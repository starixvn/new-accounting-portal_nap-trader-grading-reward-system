/**
 * jQueryUI Weekpicker
 */
(function () {    
    var configs = {};    

    $.fn.nexWeekPicker = function (options, func) {
        var $this = $(this);
        var $calendar = $this.nextAll("div:first");

        var id = $this.attr("id");

        // create a new property to store config data
        if (!configs[id]) {
            configs[id] = { date: new Date() };
        }

        var defaults = configs[id];        

        var displayYear = defaults.date.getFullYear();

        var selectCurrentWeek = function () {
            window.setTimeout(function () {
                $calendar.find('.ui-datepicker-current-day a').addClass('ui-state-active')
            }, 1);
        };

        var selectWeek = function (date, hideOnSelect) {            
            if (!date) {
                date = $calendar.datepicker('getDate');

                if (!date) {
                    date = new Date();
                }                    
            }            

            var day = date.getDay() == 0 ? 7 : date.getDay();
            var startDate = date.getDate() - day + 1;

            
            
            defaults.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            defaults.startDate.setDate(startDate);

            var instance = $this.find('input');
            if (instance.attr('name') == 'input-from') {
                if (defaults.startDate < defaults.minDate) {
                    defaults.startDate.setDate(defaults.minDate.getDate());
                    defaults.startDate.setMonth(defaults.minDate.getMonth());
                    defaults.startDate.setFullYear(defaults.minDate.getFullYear());
                }
            }
            
            defaults.endDate = new Date(date.getFullYear(), date.getMonth(), 1);
            defaults.endDate.setDate(date.getDate() - day + 7);
            if (defaults.endDate > defaults.maxDate) {
                defaults.endDate.setDate(defaults.maxDate.getDate());
                defaults.endDate.setMonth(defaults.maxDate.getMonth());
                defaults.endDate.setFullYear(defaults.maxDate.getFullYear());
            }

            if (date) {               
                if (instance.attr('name') == 'input-from') {
                    instance.val(moment(defaults.startDate).format('MM/DD/YYYY'));
                } else {
                    instance.val(moment(defaults.endDate).format('MM/DD/YYYY'));
                }                                                              
            }

            if (defaults.selectHandlers) {
                for (var i in defaults.selectHandlers) {
                    defaults.selectHandlers[i](defaults.startDate, defaults.endDate, $this[0]);
                    break;
                }
            }

            $calendar.datepicker('setDate', defaults.startDate);

            if (hideOnSelect) {
                $this.nexWeekPicker("hide");
            }            

            selectCurrentWeek();

            displayYear = defaults.startDate.getFullYear();
        };       

        // nexWeekPicker methods
        if (typeof options == "string") {
            if (options == "hide") {
                $calendar.fadeOut("fast");
            }
            else if (options == "show") {
                if ($calendar.is(":visible")) {
                    return;
                }
                selectWeek(defaults.startDate);                
                $calendar.css("left", $this.position().left).show();
            }
            else if (options == "onSelect") {
                if (!defaults.selectHandlers) {
                    defaults.selectHandlers = [];
                }
                defaults.selectHandlers.push(func);
            }
            else if (options == "getLimitDate") {
                return { minDate: defaults.minDate, maxDate: defaults.maxDate };
            } 
            else if (options == "setMinDate") {               
                $calendar.datepicker("option", {
                    minDate: func
                })                
            } 
            else if (options == "setMaxDate") {
                $calendar.datepicker("option", {
                    maxDate: func
                })               
            } 
            else if (options == "getDates") {
                return { start: defaults.startDate, end: defaults.endDate };
            }
            else if (options == "setDate") {
                selectWeek(func);
            }
        }
        else { // initialize nexWeekPicker
            $.extend(defaults, options);
            $this.find('input').addClass('ui_nexdatepicker_datetextbox hasDatepicker');            
            $this.after("<div class='weekcalendar'></div>");

            $calendar = $this.nextAll("div:first");
            $calendar.css({ "position": "absolute", "z-index": 200, "float": "left" });

            var ishover = false;

            $.extend(defaults, {
                showOn: null,
                buttonImageOnly: false,                           
                showOtherMonths: true,
                selectOtherMonths: true,
                firstDay: 1,
                showWeek: false,
                changeYear: true,
                changeMonth: true,
                calculateWeek: function (date) {
                    var week = date.getWeek();
                    var dat = date.getDate();
                    var day = date.getDay() == 0 ? 7 : date.getDay();
                    
                    var startDate = new Date(date.getFullYear(), date.getMonth(), 1);

                    startDate.setDate(date.getDate() - day + 1);

                    if (displayYear != startDate.getFullYear()) {

                        var endDate = new Date(date.getFullYear(), date.getMonth(), 1);

                        endDate.setDate(date.getDate() - day + 7);

                        if (startDate.getFullYear() != endDate.getFullYear()) {
                            week = 1;
                        }                            
                    }

                    return week;
                },                
                beforeShowDay: function (date) {
                    var cssClass = '';
                    if (date >= defaults.startDate && date <= defaults.endDate) {
                        cssClass = 'ui-datepicker-current-day';
                    }                        
                    return [true, cssClass];
                },                
                onSelect: function (dateText, instance) {
                    selectWeek(null, true);
                },
                onChangeMonthYear: function (year, month, instance) {
                    selectCurrentWeek();

                    displayYear = year;
                }
            });

            $calendar.datepicker(defaults);

            var show = function () {
                ishover = true;
                $this.nexWeekPicker("show");
            }

            $calendar.hide();

            $this.mousedown(show);

            function enter() {
                ishover = true;
            }

            function leave() {
                ishover = false;
            }

            $calendar.mouseenter(enter).mouseleave(leave);

            $this.mouseenter(enter).mouseleave(leave);

            $("*").bind("click", function (e) {
                if (!ishover) {
                    $this.nexWeekPicker("hide");
                }
            });

            $this.nextAll("button.ui-state-default:first").mouseenter(enter).mouseleave(leave).click(function () {
                // toggle calendar visibility
                if ($calendar.is(":visible"))
                    $this.nexWeekPicker("hide");
                else
                    show();
            });

            // set initial value
            var initDate = options.initDate != undefined ? options.initDate : defaults.date;

            selectWeek(initDate);
        }
    }

    $('.weekcalendar table.ui-datepicker-calendar tr').die().live({
        mousemove: function () { $(this).find('td a').addClass('ui-state-hover'); },
        mouseleave: function () { $(this).find('td a').removeClass('ui-state-hover'); }
    });

}(jQuery));

Date.prototype.getWeek = function () {
    // Copy date so don't modify original
    d = new Date(this);
    d.setHours(0, 0, 0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(), 0, 1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7) + 1;
    // Return array of year and week number
    return weekNo;
}