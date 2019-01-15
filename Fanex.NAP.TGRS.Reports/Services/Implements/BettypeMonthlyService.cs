namespace Fanex.NAP.TGRS.Reports.Services.Implements
{
    using Fanex.Data;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.Criteria.BettypeMonthlyPerformance;
    using Fanex.NAP.TGRS.Reports.Models.BettypeMonthlyPerformance;
    using Fanex.NAP.TGRS.Reports.Services.Interfaces;
    using System.Linq;

    public class BettypeMonthlyService : TGRSBaseService, IBettypeMonthlyReport
    {
        public SummaryList GenerateData(BettypeMonthlyGetCriteria criteria)
        {
            using (var db = new ObjectDb(criteria.GetSettingKey()))
            using (var multi = db.QueryMultiple(criteria))
            {
                var months = multi.Read<BettypeSummary>();

                var fsts = multi.Read<BettypeSummary>();
                var snds = multi.Read<BettypeSummary>();

                var full = multi.Read<BettypeSummary>();

                var data = full
                    .GroupJoin(fsts, s => s.Bettype, s => s.Bettype, (f, fst) => new BettypeMonthlySummary
                    {
                        BettypeId = f.Bettype,
                        BettypeName = f.BettypeName,
                        FstHalf = fst.FirstOrDefault(),
                        FullYear = f
                    })
                    .GroupJoin(snds, f => f.BettypeId, s => s.Bettype, (f, snd) =>
                    {
                        f.SndHalf = snd.FirstOrDefault();
                        return f;
                    })
                    .GroupJoin(months, f => f.BettypeId, s => s.Bettype, (f, g) =>
                    {
                        f.Months = g.ToDictionary(s => s.MonthNo.ToString(), s => (Summary)s);
                        return f;
                    });

                return new SummaryList(data);
            }
        }

        public byte[] GenerateExcel(BettypeMonthlyGetCriteria critieria, int[] showColumns, string template)
        {
            var wb = ExcelUtilities.GetWorkbook(template);

            var data = GenerateData(critieria);

            var config = new BettypeMonthlyExcelConfig(showColumns, critieria.Year);

            config.RenderExcel(wb, null, data.Data, data.Total);

            return ExcelUtilities.ToBytes(wb);
        }
    }
}