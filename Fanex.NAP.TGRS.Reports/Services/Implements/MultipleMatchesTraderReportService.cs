namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.Criteria.MultipleMatchesPerformance;
    using Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance;
    using Fanex.NAP.TGRS.Reports.Models.Permission;
    using Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;

    public partial class MultipleMatchesTraderReportService : TGRSBaseService, IMultipleMatchesReportService
    {
        private const string DefaultBettypeSessionKey = "Fanex.NAP.TGRS.Reports.DefaultBettype";
        public Func<string, Fanex.NAP.Core.Business.Constant.Policy, bool> PermissionCheck { get; set; }

        /// <summary>
        ///  Gets bet types by permissions
        /// </summary>
        /// <param name="permission">permission on bettype</param>
        /// <returns></returns>
        public IEnumerable<BetTypeItem> GetBetTypes(int userId, BettypeViewPermission permission = BettypeViewPermission.All)
        {
            List<BetTypeItem> betTypes = null;
            var criteria = new GetBetTypesCriteria(permission) { UserId = userId };
            IEnumerable<BetTypeInfo> data = this.GetData<BetTypeInfo>(criteria);

            if (data != null && data.Any())
            {
                betTypes = data.Select(obj => new BetTypeItem(obj)).ToList();
            }

            SessionManager.Set<List<BetTypeItem>>(DefaultBettypeSessionKey, betTypes);
            return betTypes ?? new List<BetTypeItem>();
        }

        /// <summary>
        /// Gets the bet types from session.
        /// </summary>
        /// <returns>List of BetTypeItem objects.</returns>
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Reviewed")]
        public IEnumerable<BetTypeItem> GetBetTypesFromSession(int userId)
        {
            var betTypes = SessionManager.Get<List<BetTypeItem>>(DefaultBettypeSessionKey);
            if (betTypes == null)
            {
                var permission = (PermissionCheck == null) ? BettypeViewPermission.All : ReportUtil.GetBettypePermission(PermissionCheck);
                betTypes = this.GetBetTypes(userId, permission).ToList();
            }

            return betTypes;
        }
    }
}