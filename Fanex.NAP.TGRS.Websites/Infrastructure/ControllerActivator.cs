namespace Fanex.NAP.TGRS.Websites.Infrastructure
{
    using System;
    using System.Web.Mvc;
    using System.Web.Routing;
    using Simplect;

    public class ControllerActivator : IControllerActivator
    {
        private readonly IInjector _injector;

        public ControllerActivator(IInjector injector)
        {
            _injector = injector;
        }

        public IController Create(RequestContext requestContext, Type controllerType)
        {
            return _injector.Resolve(controllerType) as IController;
        }
    }
}