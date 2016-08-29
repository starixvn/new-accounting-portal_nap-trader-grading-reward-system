using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fanex.NAP.Framework.Command;
using Fanex.NAP.TGRS.Core.BaseClasses;
using Fanex.NAP.TGRS.OSConfiguration.Criteria.ErrorManagement;
using Fanex.NAP.TGRS.OSConfiguration.Models.ErrorManagement;
using Fanex.NAP.TGRS.OSConfiguration.Services.Interface;

namespace Fanex.NAP.TGRS.OSConfiguration.Services.Implement
{
    public class ErrorService : TGRSBaseService, IErrorService
    {
        public IEnumerable<Error> GetAllErrors()
        {
            var criteria = new GetAllErrorCriteria();
            return GetData<Error>(criteria);
        }

        public ICommandResult InsertError(InsertErrorCriteria criteria)
        {
            return UpdateData(criteria);
        }

        public ICommandResult UpdateError(UpdateErrorCriteria criteria)
        {
            return UpdateData(criteria);
        }

        public ICommandResult UpdateErrorStatus(UpdateErrStatusCriteria criteria)
        {
            return UpdateData(criteria);
        }

        public ICommandResult DeleteError(DeleteErrorCriteria criteria)
        {
            return UpdateData(criteria);
        }
    }
}
