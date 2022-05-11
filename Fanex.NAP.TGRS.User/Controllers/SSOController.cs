// --------------------------------------------------------------------------
// <copyright file="SSOController.cs" company="Nexcel Solutions Vietnam">
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
    using System.Web;
    using System.Web.Mvc;
    using System.Web.Security;
    using Fanex.Common;
    using Fanex.NAP.Core.Business;
    //using Fanex.NAP.Core.Criteria.User;
    using Fanex.NAP.Core.Models;
    using Fanex.NAP.Core.Models.ParameterObject;
    using Fanex.NAP.Core.Service.Impl;
    using Fanex.NAP.Core.Service.Interface;
    using Fanex.NAP.Core.Web.Auth;
    using Fanex.NAP.Core.Web.Session;
    using Fanex.NAP.TGRS.Configuration.Services.SystemConfiguration;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Helpers;
    using ONEbook.UM.Filters;

    /// <summary>
    /// SSO controller.
    /// </summary>
    [CheckUMFilter]
    public class SSOController : TGRSBaseController
    {
        #region members

        private readonly int _timeExipration = 30;

        private IUserService _userService;
        private ICurrentSession _currentSession;
        private readonly ISecurityService _securityService;
        private ISystemConfigurationService _systemConfigService;

        #endregion members

        #region ctors

        [Simplect.Attribute.InjectObject]
        public SSOController()
            : this(null, null, null, null)
        {
        }

        public SSOController(
            IUserService userService,            
            ICurrentSession currentSession,
            ISecurityService securityService,
            ISystemConfigurationService systemConfigService)
        {
            this._userService = userService ?? new UserService();
            this._currentSession = currentSession ?? new CurrentSession();
            this._securityService = securityService ?? new SecurityService();
            this._systemConfigService = systemConfigService ?? new SystemConfigurationService();
        }

        #endregion ctors

        /// <summary>
        /// Index page.
        /// </summary>
        /// <param name="userId">The user ID.</param>
        /// <param name="onuserId">The online user ID.</param>
        /// <param name="time">The SSO time.</param>
        /// <param name="redirectUrl">Redirected URL after SSO.</param>
        /// <returns>Action result.</returns>
        [AllowAnonymous]
        [HttpGet]
        [SuppressMessage("StyleCop.CSharp.StylecopPlus.Rules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Reviewed. Suppression is OK here.")]
        public ActionResult Index(string userId, string onuserId, string time, Uri redirectUrl = null)
        {
            string currentTime = this._securityService.GetTime();
            string forwardLink = redirectUrl == null ? FormsAuthentication.DefaultUrl : redirectUrl.ToString();
            
            userId = Cryptography.CfsDeCrypt(userId.Replace(" ", "+"));
            onuserId = Cryptography.CfsDeCrypt(onuserId.Replace(" ", "+"));
            time = Cryptography.CfsDeCrypt(time.Replace(" ", "+"));
            var expiration = Convert.ToDateTime(currentTime) - Convert.ToDateTime(time);

            if (expiration.TotalSeconds <= this._timeExipration)
            {
                var criteria = SetUserCriteria(Convert.ToInt32(userId), Convert.ToInt32(onuserId));
                var onUserId = this._securityService.SSOLogin(criteria);

                if (onUserId != 0)
                {
                    var user = this._userService.Get(criteria.UserId);

                    // saves user session & auth info
                    this._currentSession.UserId = user.Id;
                    this._currentSession.Username = user.Username;
                    this._currentSession.OnUserId = onUserId;
                    this._currentSession.SessionId = Session.SessionID.ToString();
                    this._currentSession.Level = this._userService.GetUserLevel(user.Id, this.SiteId);

                    var IsExcludeLeague = _systemConfigService.GetLeagueExclusionConfig();
                    AppSession.IsExcludingLeagues = IsExcludeLeague;
                    AppSession.IsSoccerLivePermission = this._userService.GetPermission(user.Id, SiteId, TGRSFunctionKeys.SoccerLive) >= (int)Constant.Policy.Read ? true : false;
                    AppSession.IsSoccerNoneLivePermission = this._userService.GetPermission(user.Id, this.SiteId, TGRSFunctionKeys.SoccerNonLive) >= (int)Constant.Policy.Read ? true : false;
                    AppSession.IsVirtualPerformancePermission = this._userService.GetPermission(user.Id, SiteId, TGRSFunctionKeys.VirtualPerformance) >= (int)Constant.Policy.Read ? true : false;
                    AppSession.IsRealPerformancePermission = this._userService.GetPermission(user.Id, SiteId, TGRSFunctionKeys.RealPerformance) >= (int)Constant.Policy.Read ? true : false;

                    if (this.SiteId != 0)
                    {
                        this._currentSession.MenuItemList = this._userService.GetMenuItem(user.Id, SiteId, Environment, true).ToList();
                    }

                    this.CreateAuthInfo(user);

                    return this.Redirect(forwardLink);
                }
            }

            return this.Redirect(FormsAuthentication.LoginUrl);
        }

        #region utilities
        /// <summary>
        ///     Set new value to user criteria.
        /// </summary>
        /// <param name="userId">User id parameter.</param>
        /// <param name="onuserId">On User id.</param>
        /// <returns>Return UserCriteria.</returns>
        private SSOLoginParameter SetUserCriteria(int userId, int onuserId)
        {
            return new SSOLoginParameter
            {
                UserId = userId,
                SiteId = SiteId,
                CheckOnUserId = onuserId,
                OnUserId = 0,
                IP = CurrentContext.IP,
                NetSessionId = Session.SessionID,
                LoginDate = DateTime.Now,
                BrowserName = CurrentContext.BrowserName,
                CountryCode = CurrentContext.CountryCode,
                Domain = CurrentContext.DomainName,
                Platform = CurrentContext.Platform
            };
        }

        /// <summary>
        /// Create authorize information.
        /// </summary>
        /// <param name="user">The user object.</param>
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

        #endregion utilities
    }
}