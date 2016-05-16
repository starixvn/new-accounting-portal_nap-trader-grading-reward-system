var data = {
    GeneralInfo: {
        Winlost: 11010081.14,
        Margin: 0.71,
        Turnover: 1544237175.22,
        MatchCount: 6409
    },
    Categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    TeamMixData: [{
        type: 'column',
        yAxis: 0,
        name: 'Turnover',
        zIndex: 1,
        data: [13, 22, 13, 4, 25, 15, 7, 8, 10.9, 11, 11, 12]
    },
    {
        type: 'spline',
        name: 'Win loss',
        yAxis: 1,
        marker: {
            lineWidth: 2,
            lineColor: Highcharts.getOptions().colors[3],
            fillColor: 'white',
            width: 7,
            height: 7
        },
        zIndex: 2,
        data: [1, 5, 3, 2, 1.5, 3, 14, 22, 16, 10, 11, 12]
    }],
    BetTypePerformance: [
        {
            BetType: '1st 1x2',
            Turnover: 4449274.29,
            Winloss: 206621.29,
            Margin: 4.64
        },
        {
            BetType: '1x2',
            Turnover: 13330768.59,
            Winloss: 314539.27,
            Margin: 2.36
        }
    ]
};