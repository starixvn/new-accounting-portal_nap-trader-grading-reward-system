namespace Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance
{
    using Fanex.Common;
    using Fanex.NAP.TGRS.Core.Consts;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// Match performance view model.
    /// </summary>
    [Serializable]
    public class MatchPerformanceItem
    {
        private const char CharacterSplit = ' ';

        public MatchPerformanceItem()
        {}

        public MatchPerformanceItem(MatchPerformanceInfo matchData)
        {
            if (matchData != null && matchData.MatchId.HasValue)
            {
                this.MatchId = Converter.ToInt(matchData.MatchId);
                this.ChildMatchIdList = new List<int>();
                this.ChildMatchIdList.Add(Converter.ToInt(matchData.MatchId));
                this.TeamHomeName = CacheRef.GetTeamName(matchData.HomeId);
                this.TeamAwayName = CacheRef.GetTeamName(matchData.AwayId);
                this.MatchName = string.Format("{0} {1} {2}", this.TeamHomeName, ViewLang.Vs, this.TeamAwayName);
                this.MatchNameDisplay = this.MatchName;
                this.EventDate = matchData.EventDate;
                this.GlobalShowTime = matchData.GlobalShowTime;
                this.LeagueName = matchData.LeagueName;
                this.ParentId = Converter.ToInt(matchData.ParentId);
                this.Turnover = Converter.ToDecimal(matchData.Turnover);
                this.WinLoss = Converter.ToDecimal(matchData.WinLoss);
                this.BetCount = Converter.ToInt(matchData.BetCount);
                this.Margin = Converter.ToDecimal(matchData.Margin);
            }
        }

        public int MatchId { get; set; }

        public string MatchName { get; set; }

        public string MatchNameDisplay { get; set; }

        public List<int> ChildMatchIdList { get; set; }

        public string TeamHomeName { get; set; }

        public string TeamAwayName { get; set; }

        public string LeagueName { get; set; }

        public DateTime? EventDate { get; set; }

        public DateTime? GlobalShowTime { get; set; }

        public string KOTime
        {
            get
            {
                return this.GlobalShowTime.HasValue ?
                        this.GlobalShowTime.Value.ToShortDateString() + " " + this.GlobalShowTime.Value.ToShortTimeString()
                        : string.Empty;
            }
        }

        public int ParentId { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal Margin { get; set; }

        public void GenerateMatchNameDisplay()
        {
            var teamHomeName = GetTeamName(this.TeamHomeName);
            var teamAwayName = GetTeamName(this.TeamAwayName);

            this.MatchNameDisplay = string.Format("{0} {1} {2}", teamHomeName, ViewLang.Vs, teamAwayName);
        }

        public void GenerateMatchNameDisplayETOrPEN(string subHomeName, string subAwayName)
        {
            var teamHomeName = GetNameETOrPEN(this.TeamHomeName, subHomeName);
            var teamAwayName = GetNameETOrPEN(this.TeamAwayName, subAwayName);

            this.MatchNameDisplay = string.Format("{0} {1} {2}", teamHomeName, ViewLang.Vs, teamAwayName);
        }

        private string GetTeamName(string teamName)
        {
            if (teamName.Contains(Consts.MultipleMatchesMatchKeyNoOfConners))
            {
                return GetNameSpecialLeague(teamName, Consts.MultipleMatchesMatchKeyNoOfConners);
            }
            else if (teamName.Contains(Consts.MultipleMatchesMatchKeyConner))
            {
                return GetNameXth(teamName, Consts.MultipleMatchesMatchKeyConner);
            }
            else if (teamName.Contains(Consts.MultipleMatchesMatchKeyTotalBookings))
            {
                return GetNameSpecialLeague(teamName, Consts.MultipleMatchesMatchKeyTotalBookings);
            }
            else if (teamName.Contains(Consts.MultipleMatchesMatchKeyBooking))
            {
                return GetNameXth(teamName, Consts.MultipleMatchesMatchKeyBooking);
            }
            else if (teamName.Contains(Consts.MultipleMatchesMatchKeyGoalKick))
            {
                return GetNameGoalKick(teamName);
            }
            else if (teamName.Contains(Consts.MultipleMatchesMatchKeyGoal))
            {
                return GetNameXth(teamName, Consts.MultipleMatchesMatchKeyGoal);
            }
            else if (teamName.Contains(Consts.MultipleMatchesMatchKeyPenalty))
            {
                return GetNameXth(teamName, Consts.MultipleMatchesMatchKeyPenalty);
            }            

            return teamName;
        }

        private string GetNameSpecialLeague(string teamName, string matchKey)
        {
            var startText = teamName.IndexOf(matchKey);
            var middleText = string.Empty;

            if (this.LeagueName.ToUpper().Contains(Consts.MultipleMatchesLeagueKey10MINS.ToUpper()))
            {
                middleText = Consts.MultipleMatchesLeagueKey10MINS;
            }
            else if (this.LeagueName.ToUpper().Contains(Consts.MultipleMatchesLeagueKey15MINS.ToUpper()))
            {
                middleText = Consts.MultipleMatchesLeagueKey15MINS;
            }            

            return teamName.Substring(0, startText) + middleText + " " + Consts.MultipleMatchesMatchKeyNoOfConners;
        }

        private string GetNameXth(string teamName, string matchKey)
        {               
            var arrTeam = teamName.Split(CharacterSplit);

            var index = Array.FindIndex(arrTeam, x => x == matchKey);

            if (index >= 1)
            {
                arrTeam[index - 1] = Consts.MultipleMatchesTextNext;
            }

            return ConvertToString(arrTeam);
        }        
       
        private string GetNameGoalKick(string teamName)
        {
            var indexReplace = 0;
            var arrTeam = teamName.Split(CharacterSplit);

            for (int i = 0; i < arrTeam.Length - 1; i++)
            {
                var nextText = arrTeam[i] + CharacterSplit + arrTeam[i + 1];

                if (nextText.ToUpper().Equals(Consts.MultipleMatchesMatchKeyGoalKick.ToUpper()))
                {
                    indexReplace = i > 0 ? i - 1 : i;

                    arrTeam[indexReplace] = Consts.MultipleMatchesTextNext;

                    break;
                }
            }
      
            return ConvertToString(arrTeam);
        }

        private string GetNameETOrPEN(string parnetTeamName, string teamName)
        {
            if (parnetTeamName == teamName)
            {
                return parnetTeamName;
            }

            var arrTeam = parnetTeamName.Split(CharacterSplit);

            var index = Array.FindIndex(arrTeam, x => x == Consts.MultipleMatchesMatchKeyET);

            if (index < 0)
            {
                index = Array.FindIndex(arrTeam, x => x == Consts.MultipleMatchesMatchKeyPEN);
            }

            if (index >= 1)
            {
                arrTeam[index] = Consts.MultipleMatchesTextETPEN;
            }

            return ConvertToString(arrTeam);
        }

        private string ConvertToString(string [] array)
        {
            var result = string.Empty;

            foreach (var item in array)
            {
                result += item + CharacterSplit;
            }

            return result;
        }
    }
}