namespace Fanex.NAP.TGRS.OSConfiguration.Services.Implement
{
    using System.Collections.Generic;
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.SettingManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.SettingManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Services.Interface;

    public class SettingService : TGRSBaseService, ISettingService
    {
        public Parameter GetGlobalParameter()
        {
            var criteria = new GetGlobalParameterCriteria();
            return this.GetSingle<Parameter>(criteria);
        }

        public IEnumerable<Setting> GetSettings()
        {
            var criteria = new GetSettingAllCriteria();
            return this.GetData<Setting>(criteria);
        }

        public ICommandResult UpdateTarget(UpdateTargetCriteria criteria)
        {
            return this.UpdateData(criteria);
        }

        public IEnumerable<Sport> GetSports()
        {
            var criteria = new GetSportsCriteria();
            return this.GetData<Sport>(criteria);
        }

        public IEnumerable<League> GetLeagues(GetLeagueCriteria criteria)
        {
            return GetData<League>(criteria);
        }

        public IEnumerable<Bettype> GetBettypes()
        {
            var tmp = new BettypeGetAllCriteria();
            return GetData<Bettype>(tmp);
        }

        public ICommandResult AddSetting(AddSettingCriteria criteria)
        {
            return UpdateData(criteria);
        }

        public ICommandResult DeleteSetting(DeleteSettingCriteria criteria)
        {
            return UpdateData(criteria);
        }

        public IEnumerable<Parameter> GetParameters()
        {
            return GetData<Parameter>(new GetParametersCriteria());
        }

        public ICommandResult UpdateParamters(UpdateParameterCriteria criteria)
        {
            return UpdateData(criteria);
        }
    }
}