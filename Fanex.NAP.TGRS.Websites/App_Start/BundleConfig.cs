// --------------------------------------------------------------------------
// <copyright file="BundleConfig.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.3.31">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Websites.App_Start
{
    using System.Diagnostics.CodeAnalysis;
    using System.Web;
    using System.Web.Optimization;
    using BundleTransformer.Core.Orderers;
    using BundleTransformer.Core.Transformers;

    /// <summary>
    /// Bundle Configuration.
    /// </summary>
    public class BundleConfig
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
                "~/Content/jQuery-UI/jquery-ui-1.10.4.custom.min.css",
                "~/Content/Tipsy/tipsy.css",
                "~/Content/MsgBox/msgbox-0.0.1.css",
                "~/Content/Fanex.Grid/Fanex.Grid.css",
                "~/Content/Fanex.Grid/Fanex.Pagination.css",
                "~/Content/DatePicker/jquery.nexDatePicker.css",
                "~/Content/MonthPicker/monPickr-0.0.3.css",
                "~/Content/MonthPicker/monPickr-0.0.3-custom.less",
                "~/Content/Themes/reset.less",
                "~/Content/Themes/style.less",
                "~/Content/Themes/custom.less");

            bundles.Add(new ScriptBundle("~/scripts/common").Include(
                "~/Scripts/Libraries/jQuery/jquery-1.11.0.min.js",
                "~/Scripts/Libraries/jQuery/jquery-ui-1.10.4.min.js",
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
        }

        /// <summary>
        /// Registers the reports module's bundles.
        /// </summary>
        /// <param name="bundles">The bundle collection.</param>
        public static void RegisterReportsBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/scripts/performanceSummary").Include(
                "~/Areas/Reports/Resources/PerformanceSummary/performance-summary.js"));

            bundles.Add(new ScriptBundle("~/scripts/traderRank").Include(
                "~/Areas/Reports/Resources/PerformanceSummary/trader-rank.js"));

            bundles.AddAndInclude(
                "~/styles/performanceSummary",
                "~/Areas/Reports/Resources/PerformanceSummary/performance-summary.less");

            bundles.AddAndInclude(
                "~/styles/performanceDetail",
                "~/Areas/Reports/Resources/PerformanceDetail/performance-detail.less");

            bundles.Add(new ScriptBundle("~/scripts/leaguePerformance").Include(
                "~/Areas/Reports/Resources/PerformanceDetail/league-performance.js"));

            bundles.Add(new ScriptBundle("~/scripts/traderPerformance").Include(
                "~/Areas/Reports/Resources/PerformanceDetail/trader-performance.js"));

            bundles.Add(new ScriptBundle("~/scripts/gradePerformance").Include(
                "~/Areas/Reports/Resources/PerformanceDetail/grade-performance.js"));

            bundles.Add(new ScriptBundle("~/scripts/teamPerformance").Include(
                "~/Areas/Reports/Resources/PerformanceDetail/team-performance.js"));

            bundles.Add(new ScriptBundle("~/scripts/betTypePerformance").Include(
                "~/Areas/Reports/Resources/PerformanceDetail/bettype-performance.js"));
        }
    }

    /// <summary>
    /// Bundle Collection extension.
    /// </summary>
    [SuppressMessage("StyleCop.CSharp.MaintainabilityRules", "SA1402:FileMayOnlyContainASingleClass", Justification = "Need to review here.")]
    internal static class BundleExtensions
    {
        /// <summary>
        /// Creates a bundle, include the virtual paths to the created bundle,
        /// and add it to the bundle collection.
        /// </summary>
        /// <param name="bundles">The bundle collection which the virtual paths are included.</param>
        /// <param name="bundleVirtualPath">Virtual path of the created bundle.</param>
        /// <param name="virtualPaths">The virtual paths that needed to add to bundle collection.</param>
        public static void AddAndInclude(
            this BundleCollection bundles,
            string bundleVirtualPath,
            params string[] virtualPaths)
        {
            bundles.Add(new Bundle(bundleVirtualPath)
            {
                Transforms = { new CssTransformer(), new CssMinify() },
                Orderer = new NullOrderer()
            }.Include(virtualPaths));
        }

        /// <summary>
        /// Gets relative path from absolute path.
        /// </summary>
        /// <param name="context">The context using to get the path.</param>
        /// <param name="path">The absolute path.</param>
        /// <returns>The relative path.</returns>
        public static string RelativeFromAbsolutePath(this HttpContextBase context, string path)
        {
            var request = context.Request;
            var applicationPath = request.PhysicalApplicationPath;
            var virtualDir = request.ApplicationPath;
            virtualDir = virtualDir == "/" ? virtualDir : (virtualDir + "/");
            return path.Replace(applicationPath, virtualDir).Replace(@"\", "/");
        }
    }
}