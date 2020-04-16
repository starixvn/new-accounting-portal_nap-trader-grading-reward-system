using Fanex.MAP.TGRS.WebAPI.JobWorks;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Fanex.MAP.TGRS.WebAPI.Startup))]
namespace Fanex.MAP.TGRS.WebAPI
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            JobManager.State();            
        }
    }
}