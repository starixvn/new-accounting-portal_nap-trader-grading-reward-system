namespace Fanex.NAP.TGRS.DataReportService.Model
{
    public abstract class ChangedDataWithHeader: ChangedData
    {
        public abstract string Header { get; }
    }
}