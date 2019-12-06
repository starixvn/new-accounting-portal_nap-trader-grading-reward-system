namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;

    public interface IMultipleMatchesReportService
    {
        /// <summary>
        /// Gets the bet types from session.
        /// </summary>
        /// <returns>List of BetTypeItem objects.</returns>
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Reviewed")]
        IEnumerable<BetTypeItem> GetBetTypesFromSession(int userid);
    }
}