namespace Fanex.NAP.TGRS.Configuration.Criteria.TargetedMargin
{
    using Fanex.NAP.Framework.Data;
    using NAP.TGRS.Configuration.ViewModel.TargetedMargin;

    public class TargetedMarginCriteria : CriteriaBase
    {
        public TargetedMarginCriteria(int creatorId, TargetedMargin viewModel)
        {
            CreatorId = creatorId;
            TargetedMarginId = viewModel.TargetedMarginId;
            Rate = viewModel.Rate ?? 0;
        }

        public int TargetedMarginId { get; set; }

        public int Rate { get; set; }

        public int CreatorId { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_TargetedMargin_Update";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}