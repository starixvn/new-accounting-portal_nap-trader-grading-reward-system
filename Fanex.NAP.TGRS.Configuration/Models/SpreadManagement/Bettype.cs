// -----------------------------------------------------------------------
// <copyright file="Bettype.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Thai.Tran" date="2016.1.27">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Models.SpreadManagement
{
    public class Bettype
    {
        public int BetType { get; set; }

        public string TypeName { get; set; }

        public bool IsDefault { get; set; }        
    }
}
