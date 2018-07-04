namespace Fanex.NAP.TGRS.Core.BaseClasses
{
    using System.IO;

    internal class ExcelStream : MemoryStream
    {
        public bool AllowClose { get; set; }

        public override void Close()
        {
            if (AllowClose)
            {
                base.Close();
            }
        }
    }
}