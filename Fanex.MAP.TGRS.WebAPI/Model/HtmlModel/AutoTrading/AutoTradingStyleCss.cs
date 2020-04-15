namespace Fanex.MAP.TGRS.WebAPI.Model.HtmlModel.AutoTrading
{
    using System.Collections.Generic;

    public class AutoTradingStyleCss
    {
        public AutoTradingStyleCss() { }

        public Dictionary<string, string> StyleDivTitle
        {
            get
            {
                var attributeList = new Dictionary<string, string>();
                attributeList.Add("border", "solid 1px #d2b24d");
                attributeList.Add("background", "#44546a");
                attributeList.Add("height", "24px");
                attributeList.Add("vertical-align", "middle");
                attributeList.Add("text-align", "center");

                return attributeList;
            }
        }

        public Dictionary<string, string> StyleDivTitleLable
        {
            get
            {
                var attributeList = new Dictionary<string, string>();
                attributeList.Add("color", "white");
                attributeList.Add("font-size", "0.9em");
                attributeList.Add("font-weight", "bold");
                attributeList.Add("height", "24px");

                return attributeList;
            }
        }

        public Dictionary<string, string> StyleTable
        {
            get
            {
                var attributeList = new Dictionary<string, string>();

                attributeList.Add("border-collapse", "collapse");
                attributeList.Add("border-spacing", "0");
                attributeList.Add("cursor", "default");
                attributeList.Add("border", "solid 1px #c5c5c5");                

                return attributeList;
            }
        }

        public Dictionary<string, string> StyleTableTh
        {
            get
            {
                var attributeList = new Dictionary<string, string>();
                attributeList.Add("background-color", "#f2f2f2");
                attributeList.Add("color", "#44546a");
                attributeList.Add("vertical-align", "middle");
                attributeList.Add("border", "solid 1px #c5c5c5");
                attributeList.Add("border-top", "none");
                attributeList.Add("border-left", "none");                
                attributeList.Add("font-size", "1.0em");                                
                attributeList.Add("font-weight", "bold");
                attributeList.Add("padding", "2px");
                attributeList.Add("-webkit-box-sizing", "content-box");
                attributeList.Add("-moz-box-sizing", "content-box");
                attributeList.Add("box-sizing", "center");

                return attributeList;
            }
        }

        public Dictionary<string, string> StyleTableThSiteCredit
        {
            get
            {
                var attributeList = new Dictionary<string, string>();
                attributeList.Add("background-color", "#e2efda");
                attributeList.Add("color", "#548235");
                attributeList.Add("vertical-align", "middle");
                attributeList.Add("border", "solid 1px #c5c5c5");
                attributeList.Add("border-top", "none");
                attributeList.Add("border-left", "none");
                attributeList.Add("font-size", "1.0em");
                attributeList.Add("font-weight", "bold");
                attributeList.Add("padding", "2px");
                attributeList.Add("-webkit-box-sizing", "content-box");
                attributeList.Add("-moz-box-sizing", "content-box");
                attributeList.Add("box-sizing", "center");

                return attributeList;
            }
        }

        public Dictionary<string, string> StyleTableThSiteCash
        {
            get
            {
                var attributeList = new Dictionary<string, string>();
                attributeList.Add("background-color", "#ddebf7");
                attributeList.Add("color", "#4472c4");
                attributeList.Add("vertical-align", "middle");
                attributeList.Add("border", "solid 1px #c5c5c5");
                attributeList.Add("border-top", "none");
                attributeList.Add("border-left", "none");
                attributeList.Add("font-size", "1.0em");
                attributeList.Add("font-weight", "bold");
                attributeList.Add("padding", "2px");
                attributeList.Add("-webkit-box-sizing", "content-box");
                attributeList.Add("-moz-box-sizing", "content-box");
                attributeList.Add("box-sizing", "center");

                return attributeList;
            }
        }

        public Dictionary<string, string> StyleTableThSiteSum
        {
            get
            {
                var attributeList = new Dictionary<string, string>();
                attributeList.Add("background-color", "#f2f2f2");
                attributeList.Add("color", "#44546a");
                attributeList.Add("vertical-align", "middle");
                attributeList.Add("border", "solid 1px #c5c5c5");
                attributeList.Add("border-top", "none");
                attributeList.Add("border-left", "none");
                attributeList.Add("font-size", "1.0em");
                attributeList.Add("font-weight", "bold");
                attributeList.Add("padding", "2px");
                attributeList.Add("-webkit-box-sizing", "content-box");
                attributeList.Add("-moz-box-sizing", "content-box");
                attributeList.Add("box-sizing", "center");

                return attributeList;
            }
        }

        public Dictionary<string, string> StyleTableTd
        {
            get
            {
                var attributeList = new Dictionary<string, string>();
                attributeList.Add("background-color", "#fff");
                attributeList.Add("line-height", "inherit");
                attributeList.Add("vertical-align", "middle");
                attributeList.Add("white-space", "normal");
                attributeList.Add("border-color", "#c5c5c5");
                attributeList.Add("border-style", "solid");
                attributeList.Add("border-width", "0 1px 1px 0");
                attributeList.Add("padding", "2px");
                attributeList.Add("font-size", "1.0em");

                return attributeList;
            }
        }

        public Dictionary<string, string> StyleTableTdSite
        {
            get
            {
                var attributeList = new Dictionary<string, string>();

                attributeList.Add("background-color", "#fff2cc");
                attributeList.Add("line-height", "inherit");
                attributeList.Add("vertical-align", "middle");
                attributeList.Add("white-space", "normal");
                attributeList.Add("border-color", "#c5c5c5");
                attributeList.Add("border-style", "solid");
                attributeList.Add("border-width", "0 1px 1px 0");
                attributeList.Add("padding", "2px");
                attributeList.Add("font-size", "1.0em");
                attributeList.Add("width", "90px");

                return attributeList;
            }
        }

        public Dictionary<string, string> StyleTableTdSiteSum
        {
            get
            {
                var attributeList = new Dictionary<string, string>();
                attributeList.Add("background-color", "#fed966");
                attributeList.Add("line-height", "inherit");
                attributeList.Add("vertical-align", "middle");
                attributeList.Add("white-space", "normal");
                attributeList.Add("border-color", "#c5c5c5");
                attributeList.Add("border-style", "solid");
                attributeList.Add("border-width", "0 1px 1px 0");
                attributeList.Add("padding", "2px");
                attributeList.Add("font-size", "1.0em");
                attributeList.Add("font-weight", "bold");
                attributeList.Add("width", "90px");

                return attributeList;
            }
        }

        public Dictionary<string, string> StyleTableTdGrandTotalSite
        {
            get
            {
                var attributeList = new Dictionary<string, string>();

                attributeList.Add("background-color", "#d7e8ca");
                attributeList.Add("line-height", "inherit");
                attributeList.Add("vertical-align", "middle");
                attributeList.Add("white-space", "normal");
                attributeList.Add("border-color", "#c5c5c5");
                attributeList.Add("border-style", "solid");
                attributeList.Add("border-width", "0 1px 1px 0");
                attributeList.Add("padding", "2px");
                attributeList.Add("font-size", "1.0em");
                attributeList.Add("font-weight", "bold");

                return attributeList;
            }
        }

        public Dictionary<string, string> StyleTableTdGrandTotalSiteSum
        {
            get
            {
                return this.StyleTableTdSiteSum;
            }
        }       

        public Dictionary<string, string> StyleHeaderEmptyTableTd
        {
            get
            {
                return this.StyleTableTd;
            }
        }
    }
}