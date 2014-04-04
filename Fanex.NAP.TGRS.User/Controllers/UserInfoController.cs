// --------------------------------------------------------------------------
// <copyright file="UserInfoController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Edward.Nguyen" date="2012.8.28">Add properties _currentContext</change>
//   <change who="Jason.Ly" date="2014.4.2">Add to TGRS project.</change>
// </history>

namespace Fanex.NAP.TGRS.User.Controllers
{
    using System.Linq;
    using System.Web.Mvc;
    using Fanex.Common;
    using Fanex.NAP.Core.Criteria.User;
    using Fanex.NAP.Core.Domain;
    using Fanex.NAP.Core.Service.Impl;
    using Fanex.NAP.Core.Service.Interface;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Core.BaseClasses;

    /// <summary>
    /// User controller.
    /// </summary>
    public class UserInfoController : TGRSBaseController
    {
        private readonly IUserService _userService;

        public UserInfoController()
            : this(null)
        {
        }

        public UserInfoController(IUserService userService)
        {
            _userService = userService ?? new UserService
                {
                    ServiceContext = ServiceContext
                };
        }

        /// <summary>
        /// Redirect to changing password form.
        /// </summary>
        /// <returns>Action result.</returns>
        [HttpGet]
        public ActionResult ChangePassword()
        {
            return View(new UpdatePasswordCustCriteria { Username = CurrentSession.Username });
        }

        /// <summary>
        /// Change password action.
        /// </summary>
        /// <param name="criteria">Criteria using to update password.</param>
        /// <returns>Action result.</returns>
        [HttpPost]
        public JsonResult ChangePassword(UpdatePasswordCustCriteria criteria)
        {
            if (ModelState.IsValid)
            {
                IUser user = _userService.GetById(CurrentSession.UserId);
                string oldPwd = Cryptography.CfsEnCode(criteria.OldUserPwd);

                if (oldPwd.Equals(user.Password))
                {
                    criteria.CustId = user.Id;
                    criteria.UserPwd = Cryptography.CfsEnCode(criteria.UserPwd);

                    ICommandResult result = this._userService.InsertOrUpdate(criteria);

                    if (result != null && result.IsSuccessful)
                    {
                        ViewBag.Success = true;
                    }
                    else if (result != null && result.IsSuccessful == false)
                    {
                        ViewBag.Success = true;
                    }
                }
                else
                {
                    ModelState.AddModelError("OldUserPwd", ViewResources.Wrong_password);
                }
            }

            return Json(ModelState.Values.SelectMany(value => value.Errors).Select(error => error.ErrorMessage));
        }

        /// <summary>
        /// Redirect to profile page.
        /// </summary>
        /// <returns>Action result.</returns>
        [HttpGet]
        public ActionResult UserProfile()
        {
            var criteria = new UpdateCustCriteria();
            var user = this._userService.GetById(CurrentSession.UserId);

            criteria.CustId = user.Id;
            criteria.Username = user.Username;
            criteria.FirstName = user.FirstName;
            criteria.LastName = user.LastName;
            criteria.Email = user.Email;

            return View(criteria);
        }

        /// <summary>
        /// Update user profile.
        /// </summary>
        /// <param name="criteria">Criteria using to update user profile.</param>
        /// <returns>Action result.</returns>
        [HttpPost]
        public JsonResult UserProfile(UpdateCustCriteria criteria)
        {
            if (ModelState.IsValid)
            {
                criteria.CustId = CurrentSession.UserId;
                criteria.Username = CurrentSession.Username;
                criteria.FirstName = criteria.FirstName ?? string.Empty;
                criteria.LastName = criteria.LastName ?? string.Empty;
                criteria.Email = criteria.Email ?? string.Empty;

                ICommandResult result = this._userService.InsertOrUpdate(criteria);

                if (result != null && result.IsSuccessful)
                {
                    ViewBag.Success = true;
                }
            }

            return Json(ModelState.Values.SelectMany(value => value.Errors).Select(error => error.ErrorMessage));
        }
    }
}