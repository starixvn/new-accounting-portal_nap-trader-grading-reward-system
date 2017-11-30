namespace Fanex.NAP.TGRS.Configuration.Criteria.BettypeManagement
{
    using Fanex.NAP.Framework.Data;

    public class InsertNewBettypeCriteria : CriteriaBase
    {
        public int BettypeId { get; set; }

        public string BettypeName { get; set; }

        public int Group { get; set; }

        public int OperatorType { get; set; }

        public int AssignmentType { get; set; }

        public bool IsUsedForJuice { get; set; }

        public bool Active { get; set; }

        public int ErrCode { get; set; }

        public int UserId { get; set; }

        public string ErrMsg { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_BettypeManagement_Bettype_Insert";
        }
    }
}