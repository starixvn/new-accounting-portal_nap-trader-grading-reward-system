namespace Fanex.NAP.TGRS.WebAPI.Model
{
    using Newtonsoft.Json;
    using System.Collections;

    public class DBResult
    {
        public int ErrorCode { get; set; }

        public string ErrorMsg { get; set; }

        [JsonIgnore]
        public Hashtable OutParam { get; set; }
    }
}