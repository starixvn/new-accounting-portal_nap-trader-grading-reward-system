using System;

namespace Fanex.NAP.TGRS.Core.ExcelUtility
{
    public class Column : Attribute
    {
        public Column(string columnName)
        {
            ColumnName = columnName;
        }

        public string ColumnName { get; }
    }
}