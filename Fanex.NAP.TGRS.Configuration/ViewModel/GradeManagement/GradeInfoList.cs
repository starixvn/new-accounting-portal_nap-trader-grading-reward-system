// -----------------------------------------------------------------------
// <copyright file="GradeInfoList.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.12">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.ViewModel.GradeManagement
{
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// List of Grade Info Item.
    /// </summary>
    [Serializable]
    public class GradeInfoList
    {
        public GradeInfoList()
        {
            this.GradeInfoItems = new List<GradeInfoItem>();
        }

        public List<GradeInfoItem> GradeInfoItems { get; set; }

        public void Add(GradeInfoItem teamInfoItem)
        {
            if (teamInfoItem != null)
            {
                GradeInfoItems.Add(teamInfoItem);
            }
        }
    }
}
