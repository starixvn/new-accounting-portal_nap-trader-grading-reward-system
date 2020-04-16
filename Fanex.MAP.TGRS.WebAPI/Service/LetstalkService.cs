namespace Fanex.MAP.TGRS.WebAPI.Service
{
    using Fanex.MAP.TGRS.WebAPI.Consts;
    using Fanex.LetstalkService.Client;
    using Fanex.LetstalkService.Core.Models;
    using Fanex.LetstalkService.Core.Services;
    using System.Collections.Generic;
    using System.Configuration;  
    using Fanex.MAP.TGRS.WebAPI.JobWorks;

    public class LetstalkService
    {
        private LetstalkClientService _service;
        private List<LetstalkAttachment> _attachmentList;

        public LetstalkService()
        {
            var letstalkApi = new ApplicationSettingServiceImp();
            var webAPIClientService = new WebApiClientServiceImp(letstalkApi);
            _service = new LetstalkClientServiceImp(webAPIClientService);
            _attachmentList = new List<LetstalkAttachment>();
        }

        public LetstalkService(List<LetstalkAttachment> attachmentList)
        {
            var letstalkApi = new ApplicationSettingServiceImp();
            var webAPIClientService = new WebApiClientServiceImp(letstalkApi);
            _service = new LetstalkClientServiceImp(webAPIClientService);
            _attachmentList = attachmentList;
        }

        public bool Info(string message)
        {
            var subject = "Info";

            return SendMessage(subject, message);
        }

        public bool Info(string serviceName, string message)
        {
            var subject = "Info - " + serviceName;

            return SendMessage(subject, message);
        }

        public bool Error(string message)
        {
            var subject = "Error";

            return SendMessage(subject, message);
        }      

        private bool SendMessage(string subject, string content)
        {
            var enviroment = ConfigurationManager.AppSettings[Consts.Environment];
            var enviromentText = enviroment == "3" ? "PRO" : (enviroment == "2" ? "UAT" : "LOCAL");

            if (_attachmentList == null)
            {
                _attachmentList = new List<LetstalkAttachment>();
            }
            var message = new LetstalkModel
            {
                TargetName = JobSettings.AutoTradingConfig.TargetName,
                Subject = subject + " - " + enviromentText,
                Content = content,
                Group = JobSettings.AutoTradingConfig.Group,
                LetstalkAttachments = _attachmentList
            };

            return _service.SendMessage(message);
        }        
    }
}