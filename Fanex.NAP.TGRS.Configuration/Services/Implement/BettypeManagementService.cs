namespace Fanex.NAP.TGRS.Configuration.Services.SystemConfiguration
{
    using Fanex.Data;
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Configuration.Criteria.BettypeManagement;
    using Fanex.NAP.TGRS.Configuration.Models.BettypeManagement;
    using Fanex.NAP.TGRS.Configuration.ViewModel.BettypeManagement;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using System.Collections.Generic;
    using System.Linq;

    public class BettypeManagementService : TGRSBaseService, IBettypeManagement
    {
        public GroupBetType GetGroupBetTypes()
        {
            var criteria = new GetAllBettypeCriteria();
            var groupBetType = new GroupBetType();

            using (var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {
                using (var multi = db.QueryMultiple(criteria))
                {
                    var betTypeInfos = multi.Read<BetTypeInfo>();
                    var groupBetTypeInfos = multi.Read<GroupBetTypeInfo>();

                    if (betTypeInfos != null)
                    {
                        groupBetType.BetTypeList = betTypeInfos.Select(x => new BetType
                        {
                            BetTypeId = x.BettypeId,
                            BetTypeName = x.BettypeName,
                            Group = x.Group,
                            GroupBetTypeId = GetGroupBetTypeId(x.GroupBettypeName, groupBetTypeInfos),
                            GroupBetTypeName = x.GroupBettypeName,
                            OperatorType = x.OperatorType.HasValue ? x.OperatorType.Value : 0,
                            AssignmentBetType = x.AssignmentBetType.HasValue ? x.AssignmentBetType.Value : 0,
                            IsUsedForJuice = x.IsUsedForJuice,
                            IsActive = !x.IsDisabled
                        }).ToList();
                    }

                    if (groupBetTypeInfos != null)
                    {
                        groupBetType.GroupList = groupBetTypeInfos.Select(x => new Group
                        {
                            GroupBetTypeId = x.GroupBettypeId,
                            GroupBetTypeName = x.GroupBettypeName
                        }).ToList();
                    }
                }
            }

            return groupBetType;
        }

        private int GetGroupBetTypeId(string groupName, IEnumerable<GroupBetTypeInfo> groupBetTypeInfos)
        {
            var groupId = -1;

            if (groupBetTypeInfos != null)
            {
                var group = groupBetTypeInfos.FirstOrDefault(x => x.GroupBettypeName.Equals(groupName));

                if (group != null)
                    groupId = group.GroupBettypeId;
            }

            return groupId;
        }

        public ICommandResult InsertNewBettype(InsertNewBettypeCriteria criteria)
        {
            return UpdateData(criteria);
        }

        public ICommandResult UpdateBettype(UpdateBettypeCriteria criteria)
        {
            return UpdateData(criteria);
        }
    }
}