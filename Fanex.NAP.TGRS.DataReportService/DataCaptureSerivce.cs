namespace Fanex.NAP.TGRS.DataReportService
{
    using Fanex.Data;
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

        public ChangedDataList CapturedData
        {
            get
            {
                return GetChangedData();
            }
        }

        protected override void OnStart(string[] args)
        {
        }

        protected override void OnStop()
        {
            timer.Dispose();
        }

        public static void SendData(object state)
        {
            try
            {
                var data = GetChangedData();

                Logging.Logger.Log.Info($"data:\n\tTraders: {data.Traders.Count()}\n\tMatches: {data.Matches.Count()}");

                if (data.Traders.Any())
                {
                    var result = new Queue<string>();

                    var arr = data.Traders.ToArray();

                    RenderMsg(arr, 0, arr.Length - 1, result);

                    Logging.Logger.Log.Info($"Trader messages: {result.Count}");

                    SendMessage(new LetsTalkMessage { TargetName = target, Message = new Dictionary<string, string> { { "content", "TGRS Data Capture Service\nHi all, here's the captured changed data\n* Traders:\n" + result.First() } } });

                    foreach (var msg in result.Skip(1))
                    {
                        SendMessage(new LetsTalkMessage { TargetName = target, Message = new Dictionary<string, string> { { "content", msg } } });
                    }
                }

                if (data.Matches.Any())
                {
                    var result = new Queue<string>();

                    var arr = data.Matches.ToArray();

                    RenderMsg(arr, 0, arr.Length - 1, result);

                    Logging.Logger.Log.Info($"Match messages: {result.Count}");

                    SendMessage(new LetsTalkMessage { TargetName = target, Message = new Dictionary<string, string> { { "content", "* Matches:\n" + result.First() } } });

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

        public static void RenderMsg<T>(T[] arr, int i, int j, Queue<string> result) where T : ChangedDataWithHeader
        {
            var segment = new ArraySegment<T>(arr, i, j - i + 1);

            var str = new StringBuilder();

            RenderData(str, segment);

            if (str.Length <= 512)
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

        private static void RenderData<T>(StringBuilder builder, IEnumerable<T> data) where T : ChangedDataWithHeader
        {
            foreach (var datum in data)
            {
                builder.Append("\t" + datum.Header + "\n");
                builder.Append(string.Format("\t\t- WL: {0}/{1}\n", FormatNumer(datum.OldWinLoss ?? 0), FormatNumer(datum.NewWinLoss ?? 0)));
                builder.Append(string.Format("\t\t- TO: {0}/{1}\n", FormatNumer(datum.OldTurnover ?? 0), FormatNumer(datum.NewTurnover ?? 0)));
                builder.Append(string.Format("\t\t- #Ticket: {0}/{1}\n", (int)datum.OldBetCount.Value, (int)datum.NewBetCount.Value));
            }
        }

        private static ChangedDataList GetChangedData()
        {
            var criteria = new ChangedDataGetCriteria();

            Logging.Logger.Log.Info("Created criteria");

            using (var db = new ObjectDb(criteria.GetSettingKey()))
            using (var queries = db.QueryMultiple())
            {
                try
                {
                    Logging.Logger.Log.Info($"sql: {queries.Command.CommandText} - {nameof(queries.IsConsumed)} - {queries.IsConsumed}");

                    var data1 = queries.Read<RawChangedData>();
                    var data2 = queries.Read<RawChangedData>();

                    Logging.Logger.Log.Info($"Called SP - data1: {data1.Count()} - data2: {data2.Count()} - {nameof(queries.IsConsumed)} - {queries.IsConsumed}");

                    return new ChangedDataList(data1.Concat(data2));
                }
                catch (Exception ex)
                {
                    Logging.Logger.Log.Error(ex.Message, ex);
                    throw ex;
                }
            }
        }

        private static string FormatNumer(double a)
        {
            return a.ToString("N2");
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