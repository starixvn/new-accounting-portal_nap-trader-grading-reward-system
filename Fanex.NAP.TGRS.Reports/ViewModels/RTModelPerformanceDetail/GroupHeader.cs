namespace Fanex.NAP.TGRS.Reports.ViewModels.RTModelPerformanceDetail
{
    using System;

    [Serializable]
    public class GroupHeader
    {
        public string HeaderText { get; set; }

        public string ColumnName { get; set; }

        public int MergeColumnNumber { get; set; }
    }
}