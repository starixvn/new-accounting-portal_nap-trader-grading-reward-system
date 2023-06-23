// --------------------------------------------------------------------------
// <copyright file="TGRSBaseController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.3.31">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Core.BaseClasses
{
    using System;
    using System.Diagnostics.CodeAnalysis;
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Configuration;
    using Fanex.NAP.Core.Context;
    using Fanex.NAP.Core.Service.Impl;
    using Fanex.NAP.Core.Service.Interface;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.Core.Web.Context;
    using Fanex.NAP.Core.Web.Session;
    using Fanex.NAP.TGRS.Core.Configurations;

    /// <summary>
    /// Base controller.
    /// </summary>
    public class TGRSBaseController : Controller
    {
        private readonly ICurrentContext _currentContext;

        private readonly ICurrentSession _currentSession;

        //private readonly IServiceContext _serviceContext;

        private readonly string _environment = NapSettings.Settings.Environment;

        private readonly int _siteId = NapSettings.Settings.SiteId;

        private bool _enableDirectLogin = NapSettings.Settings.EnableDirectLogin;

        private IUserService _userService;

        public TGRSBaseController()
        {
            this._currentContext = new CurrentContext();
            ViewBag.Session = this._currentSession = new CurrentSession();
            //this._serviceContext = new ServiceContext
            //{
            //    UserId = this.CurrentSession.UserId,
            //    SiteId = this.SiteId,
            //    Ip = this.CurrentContext.IP
            //};

            //ViewFlags = new ViewFlags
            //{
            //    IsLive = this.Environment.Equals(Constant.Live),
            //    HasEditRight = false,
            //    IsReCheckin = NapSettings.Settings.EnableReCheckIn
            //};

            //ViewBag.ServerDate = ServerDate.ToShortFormatedDate();

            //this._userService = new UserService { ServiceContext = ServiceContext };

            ViewBag.ViewFlags = new ViewFlags
            {
                //IsReCheckin = (HttpContext?.Request?.IsAuthenticated ?? false);
                IsReCheckin = true
            };

            this._userService = new UserService();
        }

        public ICurrentContext CurrentContext
        {
            get { return _currentContext; }
        }

        public ICurrentSession CurrentSession
        {
            get { return _currentSession; }
        }

        //public IServiceContext ServiceContext
        //{
        //    get { return _serviceContext; }
        //}

        public string Environment
        {
            get { return _environment; }
        }

        public int SiteId
        {
            get { return _siteId; }
        }

        /// <summary>
        /// Gets a value indicating whether the current site allows users login directly.
        /// If "0", users must login through NAP Hub.
        /// </summary>
        /// <value>Is site login.</value>
        public bool EnableDirectLogin
        {
            get
            {
                return this._enableDirectLogin;
            }
        }

        protected ViewFlags ViewFlags
        {
            get
            {
                return ViewBag.ViewFlags;
            }

            set
            {
                ViewBag.ViewFlags = value;
            }
        }

        /// <summary>
        /// Gets the server date.
        /// </summary>
        /// <value>
        /// The GMT-4 date.
        /// </value>
        protected DateTime ServerDate
        {
            get
            {
                TimeZoneInfo serverTzi = TimeZoneInfo.FindSystemTimeZoneById(AppSettings.ServerTimezone);

                return TimeZoneInfo.ConvertTime(DateTime.Now, TimeZoneInfo.Local, serverTzi);
            }
        }

        /// <summary>
        /// Determines whether the specified user has the right on a function.
        /// </summary>
        /// <param name="functionKey">The function key.</param>
        /// <param name="policy">The policy.</param>
        /// <returns>Whether the specified user has the right on a function.</returns>
        public bool HasRight(string functionKey, Constant.Policy policy)
        {
            return this._userService.IsHavingPermission(this.CurrentSession.UserId, this.SiteId, functionKey, policy);
        }
    }
}