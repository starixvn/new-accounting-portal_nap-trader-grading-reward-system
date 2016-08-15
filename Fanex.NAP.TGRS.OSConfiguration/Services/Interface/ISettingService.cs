using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fanex.NAP.Framework.Command;
using Fanex.NAP.TGRS.OSConfiguration.Criteria.SettingManagement;
using Fanex.NAP.TGRS.OSConfiguration.Models.SettingManagement;

namespace Fanex.NAP.TGRS.OSConfiguration.Services.Interface
{
    public interface ISettingService
    {
        Parameter GetGlobalParameter();

        IEnumerable<Setting> GetSettings();

        ICommandResult UpdateTarget(UpdateTargetCriteria criteria);

        IEnumerable<Sport> GetSports();

        IEnumerable<League> GetLeagues(GetLeagueCriteria criteria);

        IEnumerable<Bettype> GetBettypes();

        ICommandResult AddSetting(AddSettingCriteria criteria);

        ICommandResult DeleteSetting(DeleteSettingCriteria criteria);

        IEnumerable<Parameter> GetParameters();

        ICommandResult UpdateParamters(UpdateParameterCriteria criteria);
    }
}
