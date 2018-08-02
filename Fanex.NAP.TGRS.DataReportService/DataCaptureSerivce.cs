namespace Fanex.NAP.TGRS.DataReportService
{
    using Fanex.Data;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.DataReportService.Criteria;
    using Fanex.NAP.TGRS.DataReportService.Model;
    using Newtonsoft.Json;
    using RSACryptoPad;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net.Http;
    using System.ServiceProcess;
    using System.Text;
    using System.Threading;

    public partial class DataCaptureSerivce : ServiceBase
    {
        private Timer timer = new Timer(SendData, null, 1000, 24 * 60 * 60 * 1000);

        private static string target = "TGRSDataCaptureService";

        public DataCaptureSerivce()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
        }

        protected override void OnStop()
        {
            timer.Dispose();
        }

        public static void SendData(object state = null)
        {
            try
            {
                var data = GetChangedData();

                Logging.Logger.Log.Info($"total row: {data.Count()}");

                if (data.Any())
                {
                    var result = new Queue<string>();

                    var arr = data.GroupBy(c => c.MatchId).ToArray();

                    RenderMsg(arr, 0, arr.Length - 1, result);

                    Logging.Logger.Log.Info($"messages: {result.Count}");

                    SendMessage(new LetsTalkMessage { TargetName = target, Message = new Dictionary<string, string> { { "content", "TGRS Data Capture Service\nHi all, here's the captured changed data\n" + result.First() } } });

                    foreach (var msg in result.Skip(1))
                    {
                        SendMessage(new LetsTalkMessage { TargetName = target, Message = new Dictionary<string, string> { { "content", msg } } });
                    }
                }
            }
            catch (Exception ex)
            {
                Logging.Logger.Log.Error("error", ex);
            }
        }

        public static void RenderMsg(IGrouping<int, ChangedData>[] arr, int i, int j, Queue<string> result)
        {
            var segment = new ArraySegment<IGrouping<int, ChangedData>>(arr, i, j - i + 1);

            var str = new StringBuilder();

            RenderData(str, segment);

            if (str.Length <= 512 || i == j)
            {
                result.Enqueue(str.ToString());
            }
            else
            {
                var mid_point = (i + j) / 2;

                RenderMsg(arr, i, mid_point, result);
                RenderMsg(arr, mid_point + 1, j, result);
            }
        }

        private static void SendGreetings()
        {
            var msg = new LetsTalkMessage
            {
                TargetName = target,
                Message = new Dictionary<string, string>
                {
                    {"content", "Hi all, here's the captured changed data" }
                }
            };

            SendMessage(msg);
        }

        public static void SendMessage(LetsTalkMessage message)
        {
            var url = "http://10.40.40.127:801/api/Message";

            using (var client = new HttpClient())
            {
                var encryptParam = EncryptJson(message);
                var parameter = "Parameter=" + Uri.EscapeDataString(encryptParam);
                var content = new StringContent(parameter, Encoding.UTF8, "application/x-www-form-urlencoded");
                HttpResponseMessage response = client.PostAsync(url, content).Result;
            }
        }

        private static void RenderData(StringBuilder builder, IEnumerable<IGrouping<int, ChangedData>> g)
        {
            foreach (var data in g)
            {
                builder.AppendLine($"•{CacheRef.GetTeamName(g.First().First().HomeId)} - vs - {CacheRef.GetTeamName(g.First().First().AwayId)}");

                foreach (var datum in data)
                {
                    builder.AppendLine($"\t•{datum.Bettype}");

                    if (datum.NewTraderName != datum.OldTraderName)
                    {
                        builder.AppendLine($"\t\t-Trader: {datum.OldTraderName ?? "--"} / {datum.NewTraderName ?? "--"}");
                    }

                    if (Math.Abs(datum.OldTurnover ?? double.NegativeInfinity - datum.NewTurnover ?? double.PositiveInfinity) > 0.1)
                    {
                        builder.AppendLine($"\t\t-TO: {FormatNumber(datum.OldTurnover)} / {FormatNumber(datum.NewTurnover)}");
                    }

                    if (Math.Abs(datum.OldWinLost ?? double.NegativeInfinity - datum.NewWinLost ?? double.PositiveInfinity) > 0.1)
                    {
                        builder.AppendLine($"\t\t-WL: {FormatNumber(datum.OldWinLost)} / {FormatNumber(datum.NewWinLost)}");
                    }

                    if (datum.OldBetCount != datum.NewBetCount)
                    {
                        builder.AppendLine($"\t\t-Bet count: {FormatNumber(datum.OldBetCount)} / {FormatNumber(datum.NewBetCount)}");
                    }
                }
            }
        }

        public static IEnumerable<ChangedData> GetChangedData()
        {
            var criteria = new ChangedDataGetCriteria();

            using (var db = new ObjectDb(criteria.GetSettingKey()))
            using (var query = db.QueryMultiple(criteria))
            {
                var data1 = query.Read<ChangedData>();
                var data2 = query.Read<ChangedData>();

                return data1.Concat(data2);
            }
        }

        private static string FormatNumber(double? a)
        {
            if (a.HasValue)
            {
                return a.Value.ToString("N2");
            }

            return "--";
        }

        private static string FormatNumber(int? a)
        {
            if (a.HasValue)
            {
                return a.Value.ToString("N0");
            }

            return "--";
        }

        private static string EncryptJson(object data)
        {
            var jsonData = JsonConvert.SerializeObject(data);
            var keypath = AppDomain.CurrentDomain.BaseDirectory + "/App_Data/public.snk";
            var encryptor = new EncryptionThread();

            return encryptor.EncryptString(jsonData, 1024, keypath);
        }
    }
}