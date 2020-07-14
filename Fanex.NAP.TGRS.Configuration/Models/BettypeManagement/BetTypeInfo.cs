namespace Fanex.NAP.TGRS.Configuration.Models.BettypeManagement
{
    public class BetTypeInfo
    {
        public int BettypeId { get; set; }

        public string BettypeName { get; set; }
             
        public string Group { get; set; }

        public string GroupBettypeName { get; set; }

        public short? OperatorType { get; set; }
     
        public short? AssignmentBetType { get; set; }            
    
        public bool IsUsedForJuice { get; set; }

        public bool IsDisabled { get; set; }
    }
}