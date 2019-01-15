namespace Fanex.NAP.TGRS.Reports.Services.Interfaces
{
    using Fanex.NAP.TGRS.Reports.Criteria.BettypeMonthlyPerformance;
    using Fanex.NAP.TGRS.Reports.Models.BettypeMonthlyPerformance;

    public interface IBettypeMonthlyReport
    {
        SummaryList GenerateData(BettypeMonthlyGetCriteria critieria);

        byte[] GenerateExcel(BettypeMonthlyGetCriteria critieria, int[] showColumns, string template);
    }
}