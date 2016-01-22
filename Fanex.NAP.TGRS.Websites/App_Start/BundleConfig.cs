// --------------------------------------------------------------------------
// <copyright file="BundleConfig.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.3.31">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Websites
{
    using System.Diagnostics.CodeAnalysis;
    using System.Web.Optimization;

    /// <summary>
    /// Bundle Configuration.
    /// </summary>
    public static class BundleConfig
    {
        /// <summary>
        /// Registers the bundles.
        /// </summary>
        /// <param name="bundles">The bundle collections.</param>
        public static void RegisterBundles(BundleCollection bundles)
        {
            RegisterLoginBundles(bundles);
            RegisterCommonBundles(bundles);
            RegisterConfigurationBundles(bundles);
            RegisterReportsBundles(bundles);
        }

        /// <summary>
        /// Registers the login bundles.
        /// </summary>
        /// <param name="bundles">The bundle collection.</param>
        public static void RegisterLoginBundles(BundleCollection bundles)
        {
            bundles.AddAndInclude(
                "~/styles/login",
                "~/Areas/User/Resources/Login/login.less");

            bundles.Add(new ScriptBundle("~/scripts/loginJS").Include(
                "~/Scripts/Libraries/Crypto/CryptoJS.js",
                "~/Areas/User/Resources/Login/login.js"));

            bundles.Add(new ScriptBundle("~/scripts/userProfile").Include(
                "~/Areas/User/Resources/UserInfo/user-profile.js"));

            bundles.Add(new ScriptBundle("~/scripts/changePassword").Include(
                "~/Scripts/Libraries/Crypto/CryptoJS.js",
                "~/Areas/User/Resources/UserInfo/change-password.js"));
        }

        /// <summary>
        /// Registers the common bundles.
        /// </summary>
        /// <param name="bundles">The bundle collection.</param>
        public static void RegisterCommonBundles(BundleCollection bundles)
        {
            bundles.AddAndInclude(
                "~/styles/common",
                ////"~/Content/jQuery-UI/jquery-ui-1.10.4.custom.min.css",
                "~/Content/jQuery-UI/jquery-ui-1.9.1.custom.min.css",
                "~/Content/Tipsy/tipsy.css",
                "~/Content/MsgBox/msgbox-0.0.1.css",
                "~/Content/Fanex.Grid/Fanex.Grid.css",
                "~/Content/Fanex.Grid/Fanex.Pagination.css",
                "~/Content/DatePicker/jquery.nexDatePicker.css",
                "~/Content/MonthPicker/monPickr-0.0.3.css",
                "~/Content/MonthPicker/monPickr-0.0.3-custom.less",
                "~/Content/MultipleSelect/jquery.multiselect.less",
                "~/Content/Themes/reset.less",
                "~/Content/Themes/style.less");

            bundles.Add(new ScriptBundle("~/scripts/common").Include(
                ////"~/Scripts/Libraries/jQuery/jquery-1.11.0.min.js",
                ////"~/Scripts/Libraries/jQuery/jquery-ui-1.10.4.min.js",
                "~/Scripts/Libraries/jQuery/jquery-1.8.2.min.js",
                "~/Scripts/Libraries/jQuery/jquery-ui-1.9.1.min.js",
                "~/Scripts/Libraries/jQuery/jquery.blockUI.2.66.min.js",
                "~/Scripts/Libraries/Tipsy/jquery.tipsy.js",
                "~/Scripts/Libraries/MsgBox/msgbox-0.0.1.js",
                "~/Scripts/Libraries/Others/moment.js",
                "~/Scripts/Libraries/Others/numeral.js",
                "~/Scripts/Libraries/Fanex.Grid/Fanex.Grid.js",
                "~/Scripts/Libraries/Fanex.Grid/Fanex.Pagination.js",
                "~/Scripts/Libraries/Others/namespace.js",
                "~/Scripts/Libraries/DatePicker/jquery.nexDatePicker.js",
                "~/Scripts/Libraries/MonthPicker/monPickr-0.0.3.js",
                "~/Scripts/Libraries/MultipleSelect/jquery.multiselect.js",
                "~/Scripts/Extensions/native-object-extensions.js",
                "~/Scripts/Extensions/jquery.extensions.js",
                "~/Areas/User/Resources/Login/reCheckIn.js",
                "~/Scripts/tgrs.js",
                "~/Scripts/layout.js",
                "~/Scripts/validator.js"));
        }

        /// <summary>
        /// Registers the configuration module's bundles.
        /// </summary>
        /// <param name="bundles">The bundle collection.</param>
        public static void RegisterConfigurationBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/scripts/teamManagement").Include(
                "~/Areas/Configuration/Resources/TeamManagement/team-management.js"));

            bundles.Add(new ScriptBundle("~/scripts/gradeManagement").Include(
                "~/Areas/Configuration/Resources/GradeManagement/grade-management.js"));

            bundles.Add(new ScriptBundle("~/scripts/traderManagement").Include(
                "~/Areas/Configuration/Resources/TraderManagement/trader-management.js"));

            bundles.AddAndInclude(
                "~/styles/traderManagement",
                "~/Areas/Configuration/Resources/TraderManagement/trader-management.less");

            bundles.AddAndInclude(
                "~/styles/benchmarkManagement",
                "~/Areas/Configuration/Resources/BenchmarkManagement/benchmark-management.less");

            bundles.Add(new ScriptBundle("~/scripts/benchmarkManagement").Include(
                "~/Areas/Configuration/Resources/BenchmarkManagement/team-benchmark-management.js",
                "~/Areas/Configuration/Resources/BenchmarkManagement/league-benchmark-management.js",
                "~/Areas/Configuration/Resources/BenchmarkManagement/bettype-benchmark-management.js",
                "~/Areas/Configuration/Resources/BenchmarkManagement/page-manager.js"));

            bundles.Add(new ScriptBundle("~/scripts/systemConfiguration").Include(
                "~/Areas/Configuration/Resources/SystemConfiguration/system-configuration.js"));

            bundles.AddAndInclude(
                "~/styles/systemConfiguration",
                "~/Areas/Configuration/Resources/SystemConfiguration/system-configuration.less");

            bundles.Add(new ScriptBundle("~/scripts/SpreadManagement").Include(
                "~/areas/configuration/resources/spreadManagement/spreadManagement.js"
                ));
        }

        /// <summary>
        /// Registers the reports module's bundles.
        /// </summary>
        /// <param name="bundles">The bundle collection.</param>
        [SuppressMessage("StyleCop.CSharp.Nexcel.NexcelCustomRules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Need to review here.")]
        public static void RegisterReportsBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/scripts/performanceSummary").Include(
                "~/Areas/Reports/Resources/PerformanceSummary/performance-summary.js"));

            bundles.Add(new ScriptBundle("~/scripts/traderRank").Include(
                "~/Areas/Reports/Resources/PerformanceSummary/trader-rank.js",
                "~/Areas/Reports/Resources/PerformanceSummary/grade-history.js",
                "~/Areas/Reports/Resources/PerformanceSummary/team-history.js"));

            bundles.AddAndInclude(
                "~/styles/performanceSummary",
                "~/Areas/Reports/Resources/PerformanceSummary/performance-summary.less");

            bundles.AddAndInclude(
                "~/styles/performanceDetail",
                "~/Areas/Reports/Resources/PerformanceDetail/performance-detail.less",
                "~/Areas/Reports/Resources/PerformanceSummary/performance-summary.less");

            bundles.Add(new ScriptBundle("~/scripts/leaguePerformance").Include(
                "~/Areas/Reports/Resources/PerformanceDetail/performance-detail-helper.js",
                "~/Areas/Reports/Resources/PerformanceDetail/league-performance.js",
                "~/Areas/Reports/Resources/PerformanceSummary/grade-history.js",
                "~/Areas/Reports/Resources/PerformanceSummary/team-history.js"));

            bundles.Add(new ScriptBundle("~/scripts/traderPerformance").Include(
                "~/Areas/Reports/Resources/PerformanceDetail/performance-detail-helper.js",
                "~/Areas/Reports/Resources/PerformanceDetail/trader-performance.js",
                "~/Areas/Reports/Resources/PerformanceSummary/grade-history.js",
                "~/Areas/Reports/Resources/PerformanceSummary/team-history.js"));

            bundles.Add(new ScriptBundle("~/scripts/gradePerformance").Include(
                "~/Areas/Reports/Resources/PerformanceDetail/performance-detail-helper.js",
                "~/Areas/Reports/Resources/PerformanceDetail/grade-performance.js",
                "~/Areas/Reports/Resources/PerformanceSummary/team-history.js"));

            bundles.Add(new ScriptBundle("~/scripts/teamPerformance").Include(
                "~/Areas/Reports/Resources/PerformanceDetail/performance-detail-helper.js",
                "~/Areas/Reports/Resources/PerformanceDetail/team-performance.js",
                "~/Areas/Reports/Resources/PerformanceSummary/grade-history.js"));

            bundles.Add(new ScriptBundle("~/scripts/betTypePerformance").Include(
                "~/Areas/Reports/Resources/PerformanceDetail/performance-detail-helper.js",
                "~/Areas/Reports/Resources/PerformanceDetail/bettype-performance.js",
                "~/Areas/Reports/Resources/PerformanceSummary/grade-history.js",
                "~/Areas/Reports/Resources/PerformanceSummary/team-history.js"));

            bundles.AddAndInclude(
                "~/styles/dashboard",
                "~/Content/ToggleSwitch/toggle-switch.css",
                "~/Areas/Reports/Resources/Dashboard/dashboard.less");

            bundles.Add(new ScriptBundle("~/scripts/dashboard").Include(
                "~/Scripts/Libraries/jQuery/jquery.cookie.js",
                "~/Scripts/Libraries/Highcharts/highcharts.js",
                "~/Scripts/Libraries/Highcharts/highcharts-3d.js",
                "~/Areas/Reports/Resources/Dashboard/dashboard-chart.js",
                "~/Areas/Reports/Resources/Dashboard/dashboard.js"));
        }
    }
}