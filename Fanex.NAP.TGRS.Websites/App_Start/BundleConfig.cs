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
            RegisterOSConfigurationBundles(bundles);
            RegisterOSReportBundles(bundles);
            RegisterOSAdministrationBundles(bundles);
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
                "~/Content/jQuery-UI/jquery-ui-1.10.4.custom.min.css",
                ////"~/Content/jQuery-UI/jquery-ui-1.9.1.custom.min.css",
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
                "~/Scripts/Libraries/jQuery/jquery-1.8.2.min.js",
                "~/Scripts/Libraries/jQuery/jquery-ui-1.10.4.min.js",
                ////"~/Scripts/Libraries/jQuery/jquery-ui-1.9.1.min.js",
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

            bundles.Add(new ScriptBundle("~/scripts/spreadManagement").Include(
                "~/Areas/Configuration/Resources/SpreadManagement/spread-management.js",
                "~/Areas/Configuration/Resources/SpreadManagement/popup-result.js"));

            bundles.Add(new ScriptBundle("~/Scripts/TargetedMargin").Include("~/Areas/Configuration/Resources/TargetedMargin/targeted-margin.js"));

            bundles.AddAndInclude(
                "~/styles/traderManagement",
                "~/Areas/Configuration/Resources/TraderManagement/trader-management.less");

            bundles.AddAndInclude(
                "~/styles/spreadManagement",
                "~/Areas/Configuration/Resources/SpreadManagement/spread-management.less");

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

            bundles.AddAndInclude(
                "~/styles/trader",
                "~/Content/ToggleSwitch/toggle-switch.css",
                "~/Areas/Reports/Resources/Trader/trader.less");

            bundles.Add(new ScriptBundle("~/scripts/trader").Include(
                "~/Scripts/Libraries/jQuery/jquery.cookie.js",
                "~/Scripts/Libraries/Highcharts/highcharts.js",
                "~/Scripts/Libraries/Highcharts/highcharts-3d.js",
                "~/Areas/Reports/Resources/Trader/trader-chart.js",
                "~/Areas/Reports/Resources/Trader/report.js",
                "~/Areas/Reports/Resources/Trader/trader-report.js",
                "~/Areas/Reports/Resources/Trader/sampleData.js"));

            bundles.Add(new ScriptBundle("~/scripts/traderadmin").Include(
                "~/Scripts/Libraries/jQuery/jquery.cookie.js",
                "~/Scripts/Libraries/Highcharts/highcharts.js",
                "~/Scripts/Libraries/Highcharts/highcharts-3d.js",
                "~/Areas/Reports/Resources/Trader/trader-chart.js",
                "~/Areas/Reports/Resources/Trader/report.js",
                "~/Areas/Reports/Resources/Trader/trader-report-admin.js",
                "~/Areas/Reports/Resources/Trader/sampleData.js"));
        }

        public static void RegisterOSConfigurationBundles(BundleCollection bundles)
        {
            bundles.Add(
                new ScriptBundle("~/scripts/os-team-management")
                .Include("~/Areas/OSConfiguration/Resources/OSTeamManagement/team-management-factory.js")
                .Include("~/Areas/OSConfiguration/Resources/OSTeamManagement/team-management-service.js")
                .Include("~/Areas/OSConfiguration/Resources/OSTeamManagement/team-management.js"));

            bundles.Add(
                new ScriptBundle("~/scripts/os-trader-management")
                .Include("~/Areas/OSConfiguration/Resources/OSTraderManagement/trader-management-factory.js")
                .Include("~/Areas/OSConfiguration/Resources/OSTraderManagement/trader-management-service.js")
                .Include("~/Areas/OSConfiguration/Resources/OSTraderManagement/trader-management.js"));

            bundles.Add(new ScriptBundle("~/scripts/os-grade-management").Include(
                  "~/Areas/OSConfiguration/Resources/OSGradeManagement/grade-management-factory.js",
                  "~/Areas/OSConfiguration/Resources/OSGradeManagement/grade-management-service.js",
                  "~/Areas/OSConfiguration/Resources/OSGradeManagement/grade-management.js"));

            bundles.Add(new StyleBundle("~/styles/bootstrap").Include(
                "~/Content/Bootstrap/Css/bootstrap.css"));

            bundles.AddAndInclude(
                 "~/styles/normal",
                 "~/Areas/OSConfiguration/Resources/OSSetting/os-setting.css");

            bundles.Add(new ScriptBundle("~/scripts/os-setting").Include(
                "~/Areas/OSConfiguration/Resources/OSSetting/os-setting-factory.js",
                "~/Areas/OSConfiguration/Resources/OSSetting/os-setting-service.js",
                "~/Areas/OSConfiguration/Resources/OSSetting/os-setting.js"));


            bundles.Add(new ScriptBundle("~/scripts/os-error-management").Include(
                "~/Areas/OSConfiguration/Resources/OSErrorManagement/error-management-factory.js",
                "~/Areas/OSConfiguration/Resources/OSErrorManagement/error-management-service.js",
                "~/Areas/OSConfiguration/Resources/OSErrorManagement/error-management.js"));

            bundles.AddAndInclude(
                 "~/styles/error-management",
                 "~/Areas/OSConfiguration/Resources/OSErrorManagement/error-management.css");
        }

        public static void RegisterOSReportBundles(BundleCollection bundles)
        {
            bundles.AddAndInclude(
                "~/styles/sport-performance",
                "~/Areas/OSReports/Resources/OSSportPerformance/sport-performance.less");

            bundles.AddAndInclude(
                "~/styles/trader-performance",
                "~/Areas/OSReports/Resources/OSTraderPerformance/trader-performance.less");

            bundles.Add(new ScriptBundle("~/scripts/sport-performance").Include(
                "~/Areas/OSReports/Resources/OSSportPerformance/sport-performance-factory.js",
                "~/Areas/OSReports/Resources/OSSportPerformance/sport-performance-service.js",
                "~/Areas/OSReports/Resources/OSSportPerformance/sport-performance.js"));

            bundles.Add(
                new ScriptBundle("~/scripts/os-trader-report")
                .Include(
                    "~/Areas/OSReports/Resources/OSTraderPerformance/trader-report-factory.js",
                    "~/Areas/OSReports/Resources/OSTraderPerformance/trader-report-service.js",
                    "~/Areas/OSReports/Resources/OSTraderPerformance/trader-report.js"));
        }

        public static void RegisterOSAdministrationBundles(BundleCollection bundles)
        {
            bundles.Add(
                new ScriptBundle("~/scripts/os-score-confirmation")
                .Include(
                    "~/Areas/OSAdministration/Resources/OSScoreConfirmation/score-confirmation-factory.js",
                    "~/Areas/OSAdministration/Resources/OSScoreConfirmation/score-confirmation-service.js",
                    "~/Areas/OSAdministration/Resources/OSScoreConfirmation/score-confirmation.js"));

            bundles.Add(
                new ScriptBundle("~/scripts/os-score-history")
                .Include(
                    "~/Areas/OSAdministration/Resources/OSScoreHistory/score-history-factory.js",
                    "~/Areas/OSAdministration/Resources/OSScoreHistory/score-history-service.js",
                    "~/Areas/OSAdministration/Resources/OSScoreHistory/score-history.js"));
        }
    }
}