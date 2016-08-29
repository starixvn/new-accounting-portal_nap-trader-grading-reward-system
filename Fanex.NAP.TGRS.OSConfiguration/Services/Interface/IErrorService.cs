using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fanex.NAP.Framework.Command;
using Fanex.NAP.TGRS.OSConfiguration.Criteria.ErrorManagement;
using Fanex.NAP.TGRS.OSConfiguration.Models.ErrorManagement;

namespace Fanex.NAP.TGRS.OSConfiguration.Services.Interface
{
    public interface IErrorService
    {
        IEnumerable<Error> GetAllErrors();

        ICommandResult InsertError(InsertErrorCriteria criteria);

        ICommandResult UpdateError(UpdateErrorCriteria criteria);

        ICommandResult UpdateErrorStatus(UpdateErrStatusCriteria criteria);

        ICommandResult DeleteError(DeleteErrorCriteria criteria);
    }
}
