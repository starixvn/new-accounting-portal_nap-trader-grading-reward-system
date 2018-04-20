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
    using System.Timers;

    public partial class DataCaptureSerivce : ServiceBase
    {
        private static ChangedDataList capturedData;

        private Timer timer = new Timer(60 * 60 * 1000);

        private static string target = "TGRSDataCaptureService";

        public DataCaptureSerivce()
        {
            InitializeComponent();
        }

        public ChangedDataList CapturedData
        {
            get
            {
                if (capturedData == null)
                {
                    return GetChangedData();
                }
                else
                {
                    return GetChangedData() - capturedData;
                }
            }
        }

        protected override void OnStart(string[] args)
        {
            timer.Elapsed += Run;
            timer.Start();
        }

        protected override void OnStop()
        {
            timer.Stop();
            timer.Dispose();
        }

        private void Run(object sender, ElapsedEventArgs e)
        {
            SendData();
        }

        public string RenderData()
        {
            if (capturedData == null)
            {
                capturedData = GetChangedData();
            }
            else
            {
                capturedData = GetChangedData() - capturedData;
            }

            var data = capturedData;

            var result = new StringBuilder();

            if (data.Traders.Any())
            {
                result.Append("- Traders:\n");
                RenderData(result, data.Traders);
            }

            if (data.Matches.Any())
            {
                result.Append("- Matches:\n");
                RenderData(result, data.Matches);
            }

            return result.ToString();
        }

        public void SendData()
        {
            var data = CapturedData;

            if (data.Traders.Any() || data.Matches.Any())
            {
                SendGreetings();
            }

            if (data.Traders.Any())
            {
                SendMessage(new LetsTalkMessage { TargetName = target, Message = new Dictionary<string, string> { { "content", "+ Traders:" } } });

                var result = new Queue<string>();

                var arr = data.Traders.ToArray();

                RenderMsg(arr, 0, arr.Length - 1, result);

                foreach (var msg in result)
                {
                    SendMessage(new LetsTalkMessage { TargetName = target, Message = new Dictionary<string, string> { { "content", msg } } });
                }
            }

            if (data.Matches.Any())
            {
                SendMessage(new LetsTalkMessage { TargetName = target, Message = new Dictionary<string, string> { { "content", "+ Matches:" } } });

                var result = new Queue<string>();

                var arr = data.Matches.ToArray();

                RenderMsg(arr, 0, arr.Length - 1, result);

                foreach (var msg in result)
                {
                    SendMessage(new LetsTalkMessage { TargetName = target, Message = new Dictionary<string, string> { { "content", msg } } });
                }
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
            var url = "http://deployment-proxy.starific.net/letstalk/api/Message";

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
                builder.Append(string.Format("\t\t- #Ticket: {0}/{1}\n", datum.OldBetCount, datum.NewBetCount));
            }
        }

        private static ChangedDataList GetChangedData()
        {
            var criteria = new ChangedDataGetCriteria();

            using (var db = new ObjectDb(criteria.GetSettingKey()))
            using (var queries = db.QueryMultiple())
            {
                var data1 = queries.Read<RawChangedData>();
                var data2 = queries.Read<RawChangedData>();

                return new ChangedDataList(data1.Concat(data2));
            }
        }

        private static string FormatNumer(double a)
        {
            if ((int)a == a)
            {
                return a + ".00";
            }

            var rounded = Math.Round(a, 2);

            if ((int)(rounded * 10) == rounded * 10)
            {
                return rounded + "0";
            }

            return rounded.ToString();
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