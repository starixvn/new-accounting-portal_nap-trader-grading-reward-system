namespace Fanex.NAP.TGRS.Reports.Services.Interfaces
{
    using Fanex.NAP.TGRS.Reports.Models.BettypeMonthlyPerformance;

    public interface IBettypeMonthlyReport
    {
        SummaryList GenerateData(string bettypes, int year);

        byte[] GenerateExcel(string bettypes, int year, int[] showColumns, string template);
    }
}