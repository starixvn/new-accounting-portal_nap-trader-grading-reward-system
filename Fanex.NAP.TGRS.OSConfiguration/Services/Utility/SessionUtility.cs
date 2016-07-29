namespace Fanex.NAP.TGRS.OSConfiguration.Services.Utility
{
    using Core.Helpers;

    public static class SessionUtility
    {
        public static int GetCreatorId()
        {
            return AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 8;
        }
    }
}