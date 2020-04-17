namespace Fanex.MAP.TGRS.WebAPI.Service
{    
    using System.Threading.Tasks;

    public interface IAutoTradingPerformanceService
    {
        byte[] GetAutoTradingTAMonthly();

        byte[] GetAutoTradingPTAndAfterVRAdjustment();

        byte[] GetAutoTradingRT3AndTAComparition();

        Task WriteAutoTradingTAMonthly();

        Task WriteAutoTradingPTAndAfterVRAdjustment();

        Task WriteAutoTradingRT3AndTAComparition();
    }
}