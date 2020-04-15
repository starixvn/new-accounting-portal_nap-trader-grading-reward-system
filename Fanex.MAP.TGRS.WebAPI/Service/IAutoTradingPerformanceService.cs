using System.Threading.Tasks;

namespace Fanex.MAP.TGRS.WebAPI.Service
{
    public interface IAutoTradingPerformanceService
    {
        Task WriteAutoTradingTAMonthly();

        Task WriteAutoTradingPTAndAfterVRAdjustment();

        Task WriteAutoTradingRT3AndTAComparition();
    }
}