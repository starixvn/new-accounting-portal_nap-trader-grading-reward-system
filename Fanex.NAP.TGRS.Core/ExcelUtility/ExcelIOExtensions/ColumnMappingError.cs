using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Fanex.NAP.TGRS.Core.ExcelUtility.ExcelIOExtensions
{
    public class ColumnMappingException : SystemException
    {
        public ColumnMappingException(string message, IEnumerable<string> errors) : base(message)
        {
            ErrorColumns = errors;
        }

        public IEnumerable<string> ErrorColumns { get; private set; }
    }
}
