namespace Fanex.NAP.TGRS.Reports.ViewModel.TraderManagement
{
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Reports.Models.TraderManagement;

    public class TraderInfoItem
    {
        public TraderInfoItem(TraderInfo traderInfo)
        {
            this.CustId = traderInfo.CustId;
            this.UserName = traderInfo.UserName;
            this.EmployeeId = traderInfo.EmployeeId;
            this.TeamName = traderInfo.TeamName;
            this.Grade = traderInfo.Grade;
            this.CreatedDate = traderInfo.CreatedDate.ToFullFormatedDate();
            this.CreatedUsername = traderInfo.CreatedUsername;
            this.TeamEffectiveDate = traderInfo.TeamEffectiveDate.ToShortFormatedDate();
            this.GradeEffectiveDate = traderInfo.GradeEffectiveDate.ToShortFormatedDate();
        }

        public int CustId { get; set; }

        public string UserName { get; set; }

        public string EmployeeId { get; set; }

        public string TeamName { get; set; }

        public string Grade { get; set; }

        public string CreatedDate { get; set; }

        public string CreatedUsername { get; set; }

        public string TeamEffectiveDate { get; set; }

        public string GradeEffectiveDate { get; set; }
    }
}
