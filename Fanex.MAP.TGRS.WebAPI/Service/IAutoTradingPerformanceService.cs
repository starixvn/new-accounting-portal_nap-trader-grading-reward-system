namespace Fanex.MAP.TGRS.WebAPI.Service
{        
    public interface IAutoTradingPerformanceService
    {
        byte[] GetAutoTradingTAMonthly();

        byte[] GetAutoTradingPTAndAfterVRAdjustment();

        byte[] GetAutoTradingRT3AndTAComparition();

        byte[] GetAutoTradingEventLeaguesExcel(string templatePath);

    }
}