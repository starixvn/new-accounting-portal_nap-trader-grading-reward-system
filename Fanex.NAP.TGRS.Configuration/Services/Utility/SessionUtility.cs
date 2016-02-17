namespace Fanex.NAP.TGRS.Configuration.Services.Utility
{
    using Core.Helpers;

    public static class SessionUtility
    {
        public static int GetCreatorId()
        {
            return AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0;
        }
    }
}