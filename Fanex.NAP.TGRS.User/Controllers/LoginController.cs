// --------------------------------------------------------------------------
// <copyright file="LoginController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Edward.Nguyen" date="2012.8.28">Add properties _currentContext</change>
//   <change who="Jason.Ly" date="2014.3.31">Add to TGRS project.</change>
// </history>

namespace Fanex.NAP.TGRS.User.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Security.Cryptography;
    using System.Text;
    using System.Web;
    using System.Web.Mvc;
    using System.Web.Security;
    using Core.Configurations;
    using Core.Helpers;
    using Fanex.Common.Extensions;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Configuration;
    using Fanex.NAP.Core.Criteria.User;
    using Fanex.NAP.Core.Model;
    using Fanex.NAP.Core.Service.Impl;
    using Fanex.NAP.Core.Service.Interface;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.Core.Web.Auth;
    using Fanex.NAP.Core.Web.Session;
    using Fanex.NAP.TGRS.Configuration.Services.SystemConfiguration;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using ONEbook.UM.Filters;

    /// <summary>
    /// Login controller.
    /// </summary>
    [CheckUMFilter]
    public class LoginController : TGRSBaseController
    {
        #region Members

        private const string LoginFormToken = "_SecureLoginFormToken";

        private IUserService _userService;
        private IGroupService _groupService;
        private ISiteService _siteService;
        private IMenuItemService _menuItemService;
        private ICurrentSession _currentSession;
        private IFunctionService _functionService;
        private ISystemConfigurationService _systemConfigService;
        private HashAlgorithm _hashAlgorithm;

        #endregion Members

        #region Constructors

        [Simplect.Attribute.InjectObject]
        public LoginController()
            : this(null, null, null, null, null, null, null)
        {
        }

        public LoginController(
            IUserService userService,
            IGroupService groupService,
            ISiteService siteService,
            IMenuItemService menuItemService,
            ICurrentSession currentSession,
            IFunctionService functionService,
            ISystemConfigurationService systemConfigService)
        {
            this._userService = userService ?? new UserService();
            this._groupService = groupService ?? new GroupService();
            this._siteService = siteService ?? new SiteService();
            this._menuItemService = menuItemService ?? new MenuItemService();
            this._currentSession = currentSession ?? new CurrentSession();
            this._functionService = functionService ?? new FunctionService();
            this._systemConfigService = systemConfigService ?? new SystemConfigurationService();
            this._hashAlgorithm = new SHA256Managed();
        }

        #endregion Constructors

        #region Properties

        public string FormToken
        {
            get
            {
                if (Session[LoginFormToken] == null)
                {
                    return string.Empty;
                }

                return Session[LoginFormToken].ToString();
            }

            set
            {
                Session[LoginFormToken] = value;
            }
        }

        #endregion Properties

        #region Sign in

        /// <summary>
        /// Index page.
        /// </summary>
        /// <returns>Action result.</returns>
        [HttpGet]
        public ActionResult Index()
        {
            if (!NapSettings.Settings.IsNapHub && !EnableDirectLogin)
            {
                // if login-directly feature is disabled then redirect users to NAP Hub
                return Redirect(NapSettings.Settings.HubUrl);
            }

            GenerateToken();

            return View();
        }

        /// <summary>
        /// Index page.
        /// </summary>
        /// <param name="username">The login username.</param>
        /// <param name="password">The login password.</param>
        /// <param name="loginToken">Login token.</param>
        /// <returns>Action result.</returns>
        [HttpPost]
        [ValidateInput(false)]
        [SuppressMessage("StyleCop.CSharp.StylecopPlus.Rules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Reviewed. Suppression is OK here.")]
        public ActionResult Index(string username, string password, string loginToken)
        {
            if (!username.IsNullOrTrimEmpty() && !password.IsNullOrTrimEmpty() && CheckValidToken(loginToken))
            {
                var user = this._userService.GetByUsername(username.Trim()) as User;

                if (user != null)
                {
                    string hashPassword = GetHash(user.Password + loginToken);

                    if (password == hashPassword)
                    {
                        var group = user.Group == null ? null : this._groupService.GetById(user.Group.Id);
                        var siteLevelList = this._siteService.GetSiteLevelByUser(user.Id, this.Environment); // gets all sites of logging-in user

                        ClearToken();

                        if ((group == null || group.IsActive) && siteLevelList.Where(x => x.IsActive).Any())
                        {
                            // check-in user
                            DoCheckin(user);

                            // current site is not NAP Hub
                            if (this.SiteId != 0)
                            {
                                this.CreateUserMenu(user);
                            }

                            this.CreateAuthInfo(user);

                            var currentFunction =
                                    _functionService.GetByUserAndSiteIncludeGroup(user.Id, NapSettings.Settings.SiteId, NapSettings.Settings.Environment);
                            AppSession.CurrentUser = user;
                            AppSession.RoleAccess = PermissionService.GetRoleAccess(currentFunction);
                            AppSession.IsSoccerLivePermission = (int)(_userService.GetUserSiteFunctionKeyPolicy(user.Id, SiteId, TGRSFunctionKeys.SoccerLive)) >= (int)Constant.Policy.Read ? true : false;
                            AppSession.IsSoccerNoneLivePermission = (int)(_userService.GetUserSiteFunctionKeyPolicy(user.Id, this.SiteId, TGRSFunctionKeys.SoccerNonLive)) >= (int)Constant.Policy.Read ? true : false;
                            AppSession.IsRealFigurePermission = (int)(_userService.GetUserSiteFunctionKeyPolicy(user.Id, SiteId, TGRSFunctionKeys.SportsRealFigure)) >= (int)Constant.Policy.Read ? true : false;

                            // Config for League Exclusion
                            var IsExcludeLeague = _systemConfigService.GetLeagueExclusionConfig();
                            AppSession.IsExcludingLeagues = IsExcludeLeague;

                            // if the user login directly, not through NAP Hub
                            if (this.EnableDirectLogin)
                            {
                                // checks if logging-in user is active on this site
                                if (siteLevelList.Where(x => x.Site.Id == this.SiteId && x.IsActive).Any())
                                {
                                    return Redirect(FormsAuthentication.DefaultUrl);
                                }

                                DoSignOut();
                                ViewBag.Message = ViewResources.Your_account_was_suspended;
                            }
                        }
                        else
                        {
                            // user account was suspended on all sites
                            if (siteLevelList.Count() > 0)
                            {
                                ViewBag.Message = ViewResources.Your_account_was_suspended;
                            }
                            else
                            {
                                // logging-in user belongs to no site
                                ViewBag.Message = ViewResources.You_have_no_authorization;
                            }
                        }
                    }
                    else
                    {
                        // wrong password
                        ViewBag.Message = ViewResources.Invalid_Username_or_Password;
                    }
                }
                else
                {
                    // user doesn't exist
                    ViewBag.Message = ViewResources.Invalid_Username_or_Password;
                }
            }
            else
            {
                ViewBag.Message = "Invalid input!";
            }

            GenerateToken();

            return View();
        }

        #endregion Sign in

        #region Other Actions

        /// <summary>
        /// User log out.
        /// </summary>
        /// <returns>Action result.</returns>
        public ActionResult LogOut()
        {
            this.DoSignOut();

            return this.Redirect(FormsAuthentication.LoginUrl);
        }

        /// <summary>
        /// User re-check login.
        /// </summary>
        /// <returns>Action result.</returns>
        [HttpPost]
        public ActionResult RecheckLogin()
        {
            if (!AppSettings.IsLocalTest)
            {
                // check if not nap hub
                if (this.SiteId != 0)
                {
                    var siteStatus = this._siteService.GetStatusById(this.SiteId);

                    if (!siteStatus)
                    {
                        return this.Json("1");
                    }
                }

                var criteria = new UserReCheckInUserCriteria();
                criteria.OnUserId = Convert.ToInt32(this._currentSession.OnUserId);
                this._userService.ReUserCheckIn(criteria);

                return this.Json(criteria.IsKickedOut ? "1" : "0");
            }

            return this.Json("0");
        }

        #endregion Other Actions

        #region Helpers

        /// <summary>
        /// Check in user.
        /// </summary>
        /// <param name="user">The user to be checked in.</param>
        private void DoCheckin(User user)
        {
            var criteria = new UserCheckInUserCriteria
            {
                UserId = user.Id,
                SiteId = this.SiteId,
                NetSessionId = Session.SessionID,
                Ip = CurrentContext.IP,
                LoginDate = DateTime.Now,
                BrowserName = CurrentContext.BrowserName,
                CountryCode = CurrentContext.CountryCode,
                Domain = CurrentContext.DomainName,
                Platform = CurrentContext.Platform
            };

            this._userService.UserCheckIn(criteria);

            // saves user session
            this._currentSession.Level = this._userService.GetUserSiteLevel(user.Id, this.SiteId);
            this._currentSession.UserId = user.Id;
            this._currentSession.Username = user.Username;
            this._currentSession.OnUserId = criteria.OnUserId;
            this._currentSession.SessionId = Session.SessionID.ToString();
        }

        /// <summary>
        /// Create user menu.
        /// </summary>
        /// <param name="user">The login user.</param>
        private void CreateUserMenu(User user)
        {
            this._currentSession.MenuItemList = (IList<MenuItem>)this._menuItemService.GetByUserAndSiteIncludeGroup(
                                                                                    user.Id,
                                                                                    SiteId,
                                                                                    this.Environment,
                                                                                    true);
        }

        /// <summary>
        /// Create authorize information.
        /// </summary>
        /// <param name="user">The login user.</param>
        private void CreateAuthInfo(User user)
        {
            var currentDomain = CurrentContext.CurrentDomain;

            var authInfo = new AuthInfo();

            authInfo.UserId = user.Id;
            authInfo.OnUserId = this._currentSession.OnUserId;

            var authTicket = new FormsAuthenticationTicket(
                 1,
                user.Username,
                DateTime.Now,
                DateTime.Now.AddMinutes(20000),
                false,
                authInfo.ToXml(),
                currentDomain.Path);

            string encryptedTicket = FormsAuthentication.Encrypt(authTicket);
            var authCookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket)
            {
                HttpOnly = true,
                Path = currentDomain.Path,
                Name = FormsAuthentication.FormsCookieName
            };

            Response.Cookies.Add(authCookie);
        }

        /// <summary>
        /// Does the sign out.
        /// </summary>
        private void DoSignOut()
        {
            this._userService.UserLogOut(new LogOutUserCriteria
            {
                OnUserId = this._currentSession.OnUserId
            });
            FormsAuthentication.SignOut();
            Response.Cookies.Clear();
            this._currentSession.ClearAll();
        }

        /// <summary>
        /// Adds the login token to cookie.
        /// </summary>
        /// <param name="loginToken">The login token.</param>
        private void AddTokenToCookie(string loginToken)
        {
            // Create the non-persistent secure form token cookie
            var responseCookie = new HttpCookie(LoginFormToken)
            {
                HttpOnly = true,
                Value = loginToken
            };

            // If we are using SSL, the cookie should be set to secure to
            // prevent it from being sent over HTTP connections
            if (FormsAuthentication.RequireSSL && Request.IsSecureConnection)
            {
                responseCookie.Secure = true;
            }

            // Add the cookie to the response
            Response.Cookies.Set(responseCookie);
        }

        /// <summary>
        /// Generates the token for login form.
        /// </summary>
        private void GenerateToken()
        {
            string loginToken = Guid.NewGuid().ToString("N");

            FormToken = loginToken;
            ViewBag.LoginToken = loginToken;
            AddTokenToCookie(loginToken);
        }

        /// <summary>
        /// Checks if the token is valid or not.
        /// </summary>
        /// <param name="loginToken">The login token.</param>
        /// <returns>Boolean value indicates if the login token is valid or not.</returns>
        private bool CheckValidToken(string loginToken)
        {
            return !string.IsNullOrWhiteSpace(loginToken)
                && FormToken == loginToken
                && Request.Cookies[LoginFormToken] != null
                && loginToken == Request.Cookies[LoginFormToken].Value;
        }

        /// <summary>
        /// Gets the hash value of input.
        /// </summary>
        /// <param name="input">The input.</param>
        /// <returns>Hash value of input.</returns>
        private string GetHash(string input)
        {
            var encrypted = string.Empty;

            if (!string.IsNullOrWhiteSpace(input))
            {
                var hashData = _hashAlgorithm.ComputeHash(Encoding.UTF8.GetBytes(input));

                encrypted = BitConverter.ToString(hashData).Replace("-", string.Empty).ToLower();
            }

            return encrypted;
        }

        /// <summary>
        /// Clears the token.
        /// </summary>
        private void ClearToken()
        {
            Session.Remove(LoginFormToken);

            if (Request.Cookies[LoginFormToken] != null)
            {
                HttpCookie cookie = new HttpCookie(LoginFormToken);

                cookie.Expires = DateTime.Now.AddDays(-1d);
                Response.Cookies.Add(cookie);
            }
        }

        #endregion Helpers
    }
}