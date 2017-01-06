namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.Framework.Data;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
    using Fanex.NAP.TGRS.Core.ExcelUtility.RichTextExtensions;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Criteria.NewPerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail;
    using NPOI.SS.UserModel;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public partial class NewDetailReportService : TGRSBaseService, INewDetailReportService
    {
        private const string GradePerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.NewGradePerformance";
        private const int PointInPixel = 225;

        public IEnumerable<GradePerformanceInfo> GetGradePerformance(ICriteria criteria)
        {
            var result = this.GetData<GradePerformanceInfo>(criteria);

            result = result ?? new List<GradePerformanceInfo>();

            SessionManager.Set<IEnumerable<GradePerformanceInfo>>(GradePerformanceDetailReportSessionKey, result);

            return result;
        }

        #region Private
        
        #endregion Private
    }
}