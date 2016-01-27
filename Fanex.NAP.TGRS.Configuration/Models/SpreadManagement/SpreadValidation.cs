// -----------------------------------------------------------------------
// <copyright file="SpreadValidation.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Thai.Tran" date="2016.1.27">Created</change>
// </history>

using System.Collections.Generic;

namespace Fanex.NAP.TGRS.Configuration.Models.SpreadManagement
{
    public class SpreadValidation
    {
        public Queue<SpreadChecker> ErrorSpreads { get; set; }

        public int TotalSpreads { get; set; }        
    }
}
