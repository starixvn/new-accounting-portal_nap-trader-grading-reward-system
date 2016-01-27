using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Simplect;

namespace Fanex.NAP.TGRS.Websites.Infrastructure
{
    public class ControllerActivator : IControllerActivator
    {
        private IInjector _injector;

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