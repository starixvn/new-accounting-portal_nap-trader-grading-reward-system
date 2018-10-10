namespace Fanex.NAP.TGRS.Configuration.Criteria.TargetedMargin
{
    using Fanex.Data.Repository;
    using NAP.TGRS.Configuration.Models.TargetedMargin;

    public class UpdateTargetedMarginCriteria : CriteriaBase
    {
        public UpdateTargetedMarginCriteria(int creatorId, TargetedMargin viewModel)
        {
            CreatorId = creatorId;
            TargetedMarginId = viewModel.TargetedMarginId;
            Rate = viewModel.Rate * 0.01;
        }

        public int TargetedMarginId { get; set; }

        public double Rate { get; set; }

        public int CreatorId { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_TargetedMargin_Update";
        }

        public override bool IsValid()
        {
            return 0 < Rate && Rate < 100;
        }
    }
}