namespace Fanex.NAP.TGRS.Configuration.ViewModel.BettypeManagement
{
    using System.Collections.Generic;

    public class GroupBetType
    {
        public GroupBetType()
        {
            this.BetTypeList = new List<BetType>();
            this.GroupList = new List<Group>();
        }

        public List<BetType> BetTypeList { get; set; }

        public List<Group> GroupList { get; set; }
       
    }
}