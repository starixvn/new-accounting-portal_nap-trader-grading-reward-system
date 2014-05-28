// -----------------------------------------------------------------------
// <copyright file="TraderInfoItem.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.12">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.ViewModel.TraderManagement
{
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Configuration.Models.TraderManagement;

    /// <summary>
    /// Trader info view model.
    /// </summary>
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
