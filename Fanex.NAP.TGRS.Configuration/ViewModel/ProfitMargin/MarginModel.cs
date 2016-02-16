using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Fanex.NAP.Framework.Data;

namespace Fanex.NAP.TGRS.Configuration.ViewModel.ProfitMargin
{
    public class MarginDataModel : CriteriaBase
    {
        public MarginDataModel(int creatorId, TargetedMargin viewModel)
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
