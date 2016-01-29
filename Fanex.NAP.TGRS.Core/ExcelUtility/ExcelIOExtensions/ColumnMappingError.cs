namespace Fanex.NAP.TGRS.Core.ExcelUtility.ExcelIOExtensions
{
    using System;
    using System.Collections.Generic;

    public class ColumnMappingException : SystemException
    {
        public ColumnMappingException(string message, IEnumerable<string> errors) : base(message)
        {
            ErrorColumns = errors;
        }

        public IEnumerable<string> ErrorColumns { get; private set; }
    }
}
