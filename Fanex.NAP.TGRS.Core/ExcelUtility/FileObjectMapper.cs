using System.Collections.Generic;
using System.IO;

namespace Fanex.NAP.TGRS.Core.ExcelUtility
{
    public abstract class FileObjectMapper<TSource>
    {
        public abstract IEnumerable<T> Read<T>(TSource source) where T : new();

        public abstract Stream Write<T>(IEnumerable<T> objs);

        protected abstract bool Validate(TSource source);
    }
}