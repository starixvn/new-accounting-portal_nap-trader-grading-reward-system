namespace Fanex.NAP.TGRS.Configuration.ViewModel.BettypeManagement
{
    public class BetType
    {
        public int BetTypeId { get; set; }

        public string BetTypeName { get; set; }

        public string Group { get; set; }

        public int GroupBetTypeId { get; set; }

        public string GroupBetTypeName { get; set; }

        public int OperatorType { get; set; }

        public int AssignmentBetType { get; set; }        

        public bool IsUsedForJuice { get; set; }

        public bool IsActive { get; set; }

    }
}