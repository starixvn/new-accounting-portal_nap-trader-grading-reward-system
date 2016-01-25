// --------------------------------------------------------------------------
// <copyright file="ExcelTemplateWriter.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Simon.Huynh" date="2015.1.25">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Core.ExcelUtility
{
    using System;

    public class Column : Attribute
    {
        public Column(string columnName)
        {
            ColumnName = columnName;
        }

        public string ColumnName { get; }
    }
}