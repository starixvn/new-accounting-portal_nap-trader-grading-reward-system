// --------------------------------------------------------------------------
// <copyright file="GradeManagementController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.7.26">Created</change>
// </history>
namespace Fanex.NAP.TGRS.OSConfiguration.Controllers
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using System.Web.Mvc;

    public class GradeManagementController : TGRSBaseController
    {
        public ActionResult Index()
        {
            return View();
        }

        //public JsonResult GetAllGrade()
        //{

        //}

        //public JsonResult InsertGrade(InsertGradeCriteria criteria)
        //{

        //}

        //[HttpPost]
        //public JsonResult UpdateGrade(UpdateGradeCriteria criteria)
        //{

        //}
    }
}