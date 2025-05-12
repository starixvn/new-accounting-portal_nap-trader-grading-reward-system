using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fanex.NAP.TGRS.Reports.Services.Implements;

namespace TGRS.UnitTests
{
    using System;
    using System.Collections.Generic;
    using NUnit.Framework;

    [TestFixture]
    public class CalendarHelperTests
    {
        private const int TestYear = 2025;

        [Test]
        public void GetWeekDates_January2025_Week1()
        {
            // Arrange
            int year = 2025, month = 1, weekIndex = 1;
            var expected = new List<DateTime>
            {
                new DateTime(2025, 1, 1),
                new DateTime(2025, 1, 2),
                new DateTime(2025, 1, 3),
                new DateTime(2025, 1, 4),
                new DateTime(2025, 1, 5)
            };

            // Act
            var result = CalendarHelper.GetWeekDates(year, month, weekIndex);

            // Assert
            Assert.That(result, Is.EqualTo(expected));
        }

        [Test]
        public void GetWeekDates_March2025_Week5()
        {
            // Arrange
            int year = 2025, month = 3, weekIndex = 5;
            var expected = new List<DateTime>
            {
                new DateTime(2025, 3, 24),
                new DateTime(2025, 3, 25),
                new DateTime(2025, 3, 26),
                new DateTime(2025, 3, 27),
                new DateTime(2025, 3, 28),
                new DateTime(2025, 3, 29),
                new DateTime(2025, 3, 30)
            };

            // Act
            var result = CalendarHelper.GetWeekDates(year, month, weekIndex);

            // Assert
            Assert.That(result, Is.EqualTo(expected));
        }

        [Test]
        public void GetWeekDates_May2025_Week3()
        {
            // Arrange
            int year = 2025, month = 5, weekIndex = 3;
            var expected = new List<DateTime>
            {
                new DateTime(2025, 5, 12),
                new DateTime(2025, 5, 13),
                new DateTime(2025, 5, 14),
                new DateTime(2025, 5, 15),
                new DateTime(2025, 5, 16),
                new DateTime(2025, 5, 17),
                new DateTime(2025, 5, 18),
            };

            // Act
            var result = CalendarHelper.GetWeekDates(year, month, weekIndex);

            // Assert
            Assert.That(result, Is.EqualTo(expected));
        }

        [Test]
        public void GetWeekDates_July2025_Week2()
        {
            // Arrange
            int year = 2025, month = 7, weekIndex = 2;
            var expected = new List<DateTime>
            {
                new DateTime(2025, 7, 7),
                new DateTime(2025, 7, 8),
                new DateTime(2025, 7, 9),
                new DateTime(2025, 7, 10),
                new DateTime(2025, 7, 11),
                new DateTime(2025, 7, 12),
                new DateTime(2025, 7, 13)
            };

            // Act
            var result = CalendarHelper.GetWeekDates(year, month, weekIndex);

            // Assert
            Assert.That(result, Is.EqualTo(expected));
        }

        [Test]
        public void GetWeekDates_December2025_Week5()
        {
            // Arrange
            int year = 2025, month = 12, weekIndex = 5;
            var expected = new List<DateTime>
            {
                new DateTime(2025, 12, 29),
                new DateTime(2025, 12, 30),
                new DateTime(2025, 12, 31)
            };

            // Act
            var result = CalendarHelper.GetWeekDates(year, month, weekIndex);

            // Assert
            Assert.That(result, Is.EqualTo(expected));
        }

        [Test]
        public void GetWeekDates_Year2025_Week1_ReturnsCorrectDates()
        {
            // Arrange
            int year = 2025, weekIndex = 1;
            var expected = new List<DateTime>
            {
                // January: 30/12/2024 - 5/1/2025 (only days in Jan)
                new DateTime(2025, 1, 1),
                new DateTime(2025, 1, 2),
                new DateTime(2025, 1, 3),
                new DateTime(2025, 1, 4),
                new DateTime(2025, 1, 5),

                // February: 27/1/2025 - 2/2/2025 (only days in Feb)
                new DateTime(2025, 2, 1),
                new DateTime(2025, 2, 2),

                // March: 24/2/2025 - 2/3/2025 (only days in Mar)
                new DateTime(2025, 3, 1),
                new DateTime(2025, 3, 2),

                // April: 31/3/2025 - 6/4/2025 (all days in Apr)
                new DateTime(2025, 4, 1),
                new DateTime(2025, 4, 2),
                new DateTime(2025, 4, 3),
                new DateTime(2025, 4, 4),
                new DateTime(2025, 4, 5),
                new DateTime(2025, 4, 6),

                // May: 28/4/2025 - 4/5/2025 (all days in May)
                new DateTime(2025, 5, 1),
                new DateTime(2025, 5, 2),
                new DateTime(2025, 5, 3),
                new DateTime(2025, 5, 4),

                // June: 26/5/2025 - 1/6/2025 (only days in Jun)
                new DateTime(2025, 6, 1),

                // July: 30/6/2025 - 6/7/2025 (all days in Jul)
                new DateTime(2025, 7, 1),
                new DateTime(2025, 7, 2),
                new DateTime(2025, 7, 3),
                new DateTime(2025, 7, 4),
                new DateTime(2025, 7, 5),
                new DateTime(2025, 7, 6),

                // August: 28/7/2025 - 3/8/2025 (all days in Aug)
                new DateTime(2025, 8, 1),
                new DateTime(2025, 8, 2),
                new DateTime(2025, 8, 3),

                // September: 25/8/2025 - 31/8/2025 (only days in Sep)
                new DateTime(2025, 9, 1),
                new DateTime(2025, 9, 2),
                new DateTime(2025, 9, 3),
                new DateTime(2025, 9, 4),
                new DateTime(2025, 9, 5),
                new DateTime(2025, 9, 6),
                new DateTime(2025, 9, 7),

                // October: 29/9/2025 - 5/10/2025 (all days in Oct)
                new DateTime(2025, 10, 1),
                new DateTime(2025, 10, 2),
                new DateTime(2025, 10, 3),
                new DateTime(2025, 10, 4),
                new DateTime(2025, 10, 5),

                // November: 27/10/2025 - 2/11/2025 (only days in Nov)
                new DateTime(2025, 11, 1),
                new DateTime(2025, 11, 2),

                // December: 24/11/2025 - 30/11/2025 (no days in Dec for this week)
                // December: 1/12/2025 - 7/12/2025 (all days in Dec)
                new DateTime(2025, 12, 1),
                new DateTime(2025, 12, 2),
                new DateTime(2025, 12, 3),
                new DateTime(2025, 12, 4),
                new DateTime(2025, 12, 5),
                new DateTime(2025, 12, 6),
                new DateTime(2025, 12, 7)
            };

            // Act
            var result = CalendarHelper.GetWeekDates(year, weekIndex);

            // Assert
            Assert.That(result, Is.EqualTo(expected));
        }

        [Test]
        public void GetWeekDates_Year2025_Week5_ReturnsCorrectDates()
        {
            // Arrange
            int year = 2025, weekIndex = 5;
            var expected = new List<DateTime>
            {
                // January: 27/1 - 2/2 (chỉ lấy ngày trong tháng 1)
                new DateTime(2025, 1, 27),
                new DateTime(2025, 1, 28),
                new DateTime(2025, 1, 29),
                new DateTime(2025, 1, 30),
                new DateTime(2025, 1, 31),

                // February: 24/2 - 2/3 (chỉ lấy ngày trong tháng 2)
                new DateTime(2025, 2, 24),
                new DateTime(2025, 2, 25),
                new DateTime(2025, 2, 26),
                new DateTime(2025, 2, 27),
                new DateTime(2025, 2, 28),

                // March: 31/3 - 6/4 (chỉ lấy ngày trong tháng 3)
                new DateTime(2025, 3, 24),
                new DateTime(2025, 3, 25),
                new DateTime(2025, 3, 26),
                new DateTime(2025, 3, 27),
                new DateTime(2025, 3, 28),
                new DateTime(2025, 3, 29),
                new DateTime(2025, 3, 30),

                // April: 28/4 - 4/5 (chỉ lấy ngày trong tháng 4)
                new DateTime(2025, 4, 28),
                new DateTime(2025, 4, 29),
                new DateTime(2025, 4, 30),

                // May: 26/5 - 1/6 (chỉ lấy ngày trong tháng 5)
                new DateTime(2025, 5, 26),
                new DateTime(2025, 5, 27),
                new DateTime(2025, 5, 28),
                new DateTime(2025, 5, 29),
                new DateTime(2025, 5, 30),
                new DateTime(2025, 5, 31),

                // June: 30/6 - 6/7 (chỉ lấy ngày trong tháng 6)
                new DateTime(2025, 6, 23),
                new DateTime(2025, 6, 24),
                new DateTime(2025, 6, 25),
                new DateTime(2025, 6, 26),
                new DateTime(2025, 6, 27),
                new DateTime(2025, 6, 28),
                new DateTime(2025, 6, 29),

                // July: 28/7 - 3/8 (chỉ lấy ngày trong tháng 7)
                new DateTime(2025, 7, 28),
                new DateTime(2025, 7, 29),
                new DateTime(2025, 7, 30),
                new DateTime(2025, 7, 31),

                // August: 25/8 - 31/8 (chỉ lấy ngày trong tháng 8)
                new DateTime(2025, 8, 25),
                new DateTime(2025, 8, 26),
                new DateTime(2025, 8, 27),
                new DateTime(2025, 8, 28),
                new DateTime(2025, 8, 29),
                new DateTime(2025, 8, 30),
                new DateTime(2025, 8, 31),

                // September: 29/9 - 5/10 (chỉ lấy ngày trong tháng 9)
                new DateTime(2025, 9, 29),
                new DateTime(2025, 9, 30),

                // October: 27/10 - 2/11 (chỉ lấy ngày trong tháng 10)
                new DateTime(2025, 10, 27),
                new DateTime(2025, 10, 28),
                new DateTime(2025, 10, 29),
                new DateTime(2025, 10, 30),
                new DateTime(2025, 10, 31),

                // November: 24/11 - 30/11 (chỉ lấy ngày trong tháng 11)
                new DateTime(2025, 11, 24),
                new DateTime(2025, 11, 25),
                new DateTime(2025, 11, 26),
                new DateTime(2025, 11, 27),
                new DateTime(2025, 11, 28),
                new DateTime(2025, 11, 29),
                new DateTime(2025, 11, 30),

                // December: 29/12 - 4/1/2026 (chỉ lấy ngày trong tháng 12)
                new DateTime(2025, 12, 29),
                new DateTime(2025, 12, 30),
                new DateTime(2025, 12, 31)
            };

            // Act
            var result = CalendarHelper.GetWeekDates(year, weekIndex);

            // Assert
            Assert.That(result, Is.EqualTo(expected));
        }

        [Test]
        public void GetWeekDatesOfYear_2025_Week1_ReturnsCorrectDates()
        {
            // Arrange
            int year = 2025, week = 1;
            var expected = new List<DateTime>
            {
                new DateTime(2024, 12, 30),
                new DateTime(2024, 12, 31),
                new DateTime(2025, 1, 1),
                new DateTime(2025, 1, 2),
                new DateTime(2025, 1, 3),
                new DateTime(2025, 1, 4),
                new DateTime(2025, 1, 5)
            };

            // Act
            var result = CalendarHelper.GetWeekDatesOfYear(year, week);

            // Assert
            Assert.That(result, Is.EqualTo(expected));
        }

        [Test]
        public void GetWeekDatesOfYear_2025_Week30_ReturnsCorrectDates()
        {
            // Arrange
            int year = 2025, week = 30;
            var expected = new List<DateTime>
            {
                new DateTime(2025, 7, 21),
                new DateTime(2025, 7, 22),
                new DateTime(2025, 7, 23),
                new DateTime(2025, 7, 24),
                new DateTime(2025, 7, 25),
                new DateTime(2025, 7, 26),
                new DateTime(2025, 7, 27)
            };

            // Act
            var result = CalendarHelper.GetWeekDatesOfYear(year, week);

            // Assert
            Assert.That(result, Is.EqualTo(expected));
        }

        [Test]
        public void GetWeekDatesOfYear_2025_Week52_ReturnsCorrectDates()
        {
            // Arrange
            int year = 2025, week = 52;
            var expected = new List<DateTime>
            {
                new DateTime(2025, 12, 22),
                new DateTime(2025, 12, 23),
                new DateTime(2025, 12, 24),
                new DateTime(2025, 12, 25),
                new DateTime(2025, 12, 26),
                new DateTime(2025, 12, 27),
                new DateTime(2025, 12, 28)
            };

            // Act
            var result = CalendarHelper.GetWeekDatesOfYear(year, week);

            // Assert
            Assert.That(result, Is.EqualTo(expected));
        }

        [Test]
        public void GetWeekDatesOfYear_2025_Week53_ReturnsCorrectDates()
        {
            // Arrange
            int year = 2025, week = 53;
            var expected = new List<DateTime>
            {
                new DateTime(2025, 12, 29),
                new DateTime(2025, 12, 30),
                new DateTime(2025, 12, 31),
                new DateTime(2026, 1, 1),
                new DateTime(2026, 1, 2),
                new DateTime(2026, 1, 3),
                new DateTime(2026, 1, 4),
            };

            // Act
            var result = CalendarHelper.GetWeekDatesOfYear(year, week);

            // Assert
            Assert.That(result, Is.EqualTo(expected));
        }
    }
}
