// -----------------------------------------------------------------------
// <copyright file="GradeInfo.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron" date="2016.07.29">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSConfiguration.Models.GradeManagement
{
    using System;

    public class GradeInfo
    {
        public int GradeId { get; set; }

        public string GradeName { get; set; }

        public int TraderCount { get; set; }

        public DateTime CreatedDate { get; set; }

        public string CreatedBy { get; set; }

        public string CreatedDateFormatted
        {
            get
            {
                return CreatedDate.ToString("MM/dd/yyyy hh:mm:ss");
            }
        }
    }
}