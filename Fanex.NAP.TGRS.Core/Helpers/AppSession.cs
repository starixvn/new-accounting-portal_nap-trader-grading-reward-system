// ----------------------------------------------------------------------
// <copyright file="AppSession.cs" company="Nexcel Solutions Vietnam">
//     Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// ------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016/01/25">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Core.Helpers
{
    using System;
    using System.Collections.Generic;
    using Logging;
    using NAP.Core.Models;

    /// <summary>
    /// AppSession class.
    /// </summary>
    public static class AppSession
    {
        private const string CurrentActionNameKey = "Fanex.NAP.TGRS.Contants.AppSession.CurrentActionName";
        private const string CurrentLogInUserKey = "Fanex.NAP.TGRS.Contants.AppSession.CurrentLogInUser";
        private const string CurrentUserMenuKey = "Fanex.NAP.TGRS.Contants.AppSession.CurrentUserMenu";
        private const string CurrentUserRoleAccessKey = "Fanex.NAP.TGRS.Contants.AppSession.CurrentUserRoleAccess";

        private const string IsAccountingLoginKey = "Fanex.NAP.TGRS.Contants.AppSession.IsAccountingLogin";
        private const string ViewIpVnKey = "ViewIPVN";
        private const string CurrentWorkingOnMenuKey = "Fanex.NAP.TGRS.Contants.AppSession.CurrentWorkingOnMenu";
        private const string IsExcludingLeaguesKey = "Fanex.NAP.TGRS.Contants.AppSession.IsExcludingLeagues";
        private const string IsSoccerLivePermissionKey = "Fanex.NAP.TGRS.Contants.AppSession.IsSoccerLivePermission";
        private const string IsSoccerNoneLivePermissionKey = "Fanex.NAP.TGRS.Contants.AppSession.IsSoccerNoneLivePermission";
        private const string CurrentMarketSelectionKey = "Fanex.NAP.TGRS.Contants.AppSession.CurrentMarketSelection";
        private const string IsRealFigurePermissionKey = "Fanex.NAP.TGRS.Contants.AppSession.IsRealFigurePermission";
        private const string IsVirtualPerformancePermissionKey = "Fanex.NAP.TGRS.Contants.AppSession.IsVirtualPerformancePermission";
        private const string IsRealPerformancePermissionKey = "Fanex.NAP.TGRS.Contants.AppSession.IsRealPerformancePermission";


        /// <summary>
        ///     Gets or sets current login user.
        /// </summary>
        /// <value>Current User.</value>
        public static User CurrentUser
        {
            get { return SessionManager.Get<User>(CurrentLogInUserKey); }

            set { SessionManager.Set(CurrentLogInUserKey, value); }
        }

        /// <summary>
        ///     Gets or sets menu of current login user.
        /// </summary>
        /// <value>Current User Menu.</value>
        public static IList<MenuItem> CurrentUserMenu
        {
            get { return SessionManager.Get<IList<MenuItem>>(CurrentUserMenuKey); }

            set { SessionManager.Set(CurrentUserMenuKey, value); }
        }

        public static Dictionary<string, int> RoleAccess
        {
            get
            {
                try
                {
                    return SessionManager.Get<Dictionary<string, int>>(CurrentUserRoleAccessKey);
                }
                catch (Exception exception)
                {
                    LogService.Error(exception.Message, exception);
                    throw;
                }
            }

            set
            {
                SessionManager.Set(CurrentUserRoleAccessKey, value);
            }
        }

        /// <summary>
        ///     Gets or sets current working menu url.
        /// </summary>
        /// <value>Current Working On Menu.</value>
        public static MenuItem CurrentWorkingOnMenu
        {
            get { return SessionManager.Get<MenuItem>(CurrentWorkingOnMenuKey); }

            set { SessionManager.Set(CurrentWorkingOnMenuKey, value); }
        }

        /// <summary>
        ///     Gets or sets IsTrackedMenu: determine current working on menu is.
        ///     tracked for page tracking or not.
        /// </summary>
        /// <value>Current Action Name.</value>
        public static string CurrentActionName
        {
            get { return SessionManager.Get<string>(CurrentActionNameKey); }

            set { SessionManager.Set(CurrentActionNameKey, value); }
        }

        public static bool IsAccountingLogin
        {
            get { return SessionManager.Get<bool>(IsAccountingLoginKey); }

            set { SessionManager.Set(IsAccountingLoginKey, value); }
        }

        public static bool ViewIPVN
        {
            get { return SessionManager.Get<bool>(ViewIpVnKey); }

            set { SessionManager.Set(ViewIpVnKey, value); }
        }

        public static bool IsExcludingLeagues
        {
            get { return SessionManager.Get<bool>(IsExcludingLeaguesKey); }

            set { SessionManager.Set(IsExcludingLeaguesKey, value); }
        }

        public static bool IsSoccerLivePermission
        {
            get { return SessionManager.Get<bool>(IsSoccerLivePermissionKey); }

            set { SessionManager.Set(IsSoccerLivePermissionKey, value); }
        }

        public static bool IsSoccerNoneLivePermission
        {
            get { return SessionManager.Get<bool>(IsSoccerNoneLivePermissionKey); }

            set { SessionManager.Set(IsSoccerNoneLivePermissionKey, value); }
        }
        
        public static int CurrentMarketSelection
        {
            get { return SessionManager.Get<int>(CurrentMarketSelectionKey); }

            set { SessionManager.Set(CurrentMarketSelectionKey, value); }
        }

        public static bool IsVirtualPerformancePermission
        {
            get { return SessionManager.Get<bool>(IsVirtualPerformancePermissionKey); }

            set { SessionManager.Set(IsVirtualPerformancePermissionKey, value); }
        }

        public static bool IsRealPerformancePermission
        {
            get { return SessionManager.Get<bool>(IsRealPerformancePermissionKey); }

            set { SessionManager.Set(IsRealPerformancePermissionKey, value); }
        }
    }
}