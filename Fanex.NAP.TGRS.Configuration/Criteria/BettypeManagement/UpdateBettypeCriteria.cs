namespace Fanex.NAP.TGRS.Configuration.Criteria.BettypeManagement
{
    using Fanex.Data.Repository;

    public class UpdateBettypeCriteria : CriteriaBase
    {
        public int BettypeId { get; set; }

        public int? NewBettypeId { get; set; }

        public string BettypeName { get; set; }

        public int? Group { get; set; }

        public int? OperatorType { get; set; }

        public int? AssignmentBetType { get; set; }

        public bool? UsedForJuice { get; set; }

        public bool? Active { get; set; }

        public int UserId { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_BettypeManagement_Bettype_Update";
        }
    }
}