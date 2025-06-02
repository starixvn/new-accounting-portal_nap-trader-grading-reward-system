namespace Fanex.NAP.TGRS.Reports.Services.Implements
{
    using System;
    using System.Collections.Generic;

    public static class CalendarHelper
    {
        public static List<DateTime> GetWeekDates(int year, int weekIndex)
        {
            var result = new List<DateTime>();

            for (var month = 1; month <= 12; month++)
            {
                result.AddRange(GetWeekDates(year, month, weekIndex));
            }

            return result;
        }

        public static List<DateTime> GetWeekDates(int year, int month, int weekIndex)
        {
            var result = new List<DateTime>();
            
            var firstDayOfMonth = new DateTime(year, month, 1);
            var daysOffset = ((int)DayOfWeek.Monday - (int)firstDayOfMonth.DayOfWeek + 7) % 7;
            var firstMonday = firstDayOfMonth.AddDays(daysOffset);

            var weekStart = firstMonday == firstDayOfMonth? firstMonday: firstMonday.AddDays(-7);
            weekStart = weekStart.AddDays((weekIndex - 1) * 7);
            var weekEnd = weekStart.AddDays(7);

            // Only get the date in the same month
            for (var date = weekStart; date < weekEnd; date = date.AddDays(1))
            {
                if (date.Month == month)
                {
                    result.Add(date);
                }
            }

            return result;
        }

        public static List<DateTime> GetWeekDatesOfYear(int year, int week)
        {
            var result = new List<DateTime>();

            var firstDayOfYear = new DateTime(year, 1, 1);
            var daysOffset = ((int)DayOfWeek.Monday - (int)firstDayOfYear.DayOfWeek + 7) % 7;
            var firstMonday = firstDayOfYear.AddDays(daysOffset);

            var weekStart = firstMonday == firstDayOfYear ? firstMonday : firstMonday.AddDays(-7);
            weekStart = weekStart.AddDays((week - 1) * 7);
            var weekEnd = weekStart.AddDays(7);

            // Only get the date in the same month
            for (var date = weekStart; date < weekEnd; date = date.AddDays(1))
            {
                result.Add(date);
            }

            return result;
        }

    }
}
