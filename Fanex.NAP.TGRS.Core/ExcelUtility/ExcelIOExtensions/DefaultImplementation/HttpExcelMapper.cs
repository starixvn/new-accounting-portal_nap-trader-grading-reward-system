// --------------------------------------------------------------------------
// <copyright file="HttpExcelMapper.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Simon.Huynh" date="2015.1.25">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Core.ExcelUtility.ExcelIOExtensions.DefaultImplementation
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Web;
    using NPOI.HSSF.UserModel;
    using NPOI.SS.UserModel;

    public class HttpExcelMapper : FileObjectMapper<HttpPostedFileBase>
    {
        private const string _Location = "~/App_Data/";

        private ObjectMapper _mapper = new ObjectMapper();

        public override IEnumerable<T> Read<T>(HttpPostedFileBase source)
        {
            var sheet = WorkbookFactory.Create(source.InputStream).GetSheetAt(0);

            var columnsMapping = GetColumnsMapping(sheet);
            var methodsMapping = _mapper.GetSetters<T>();
            var finalMapping = GetFinalMapping(columnsMapping, methodsMapping);

            var rowNum = 1;
            IRow row;
            while ((row = sheet.GetRow(rowNum++)) != null)
            {
                var obj = new T();

                foreach (var col in finalMapping)
                {
                    object setter = null;
                    var key = row.GetCell(col.Key);
                    try
                    {
                        setter = key.NumericCellValue;
                    }
                    catch (Exception)
                    {
                        setter = key.StringCellValue;
                    }

                    col.Value.Invoke(obj, setter);
                }

                yield return obj;
            }
        }

        public override Stream Write<T>(IEnumerable<T> objs)
        {
            var workBook = new HSSFWorkbook();
            var sheet = workBook.CreateSheet();

            var columnMapping = _mapper.GetGetters<T>();
            var columnNames = _mapper.GetPropertiesName<T>();

            var rowHeader = sheet.CreateRow(0);
            var col = 0;
            foreach (var columnName in columnNames)
            {
                rowHeader.CreateCell(col++).SetCellValue(columnName);
            }

            var row = 1;
            foreach (var obj in objs)
            {
                var rowObj = sheet.CreateRow(row++);
                for (int i = 0; i < columnMapping.Count; ++i)
                {
                    rowObj.CreateCell(i).SetCellValue(columnMapping[i].Invoke(obj).ToString());
                }
            }

            var stream = new MemoryStream();
            workBook.Write(stream);
            return stream;
        }

        protected override bool Validate(HttpPostedFileBase source)
        {
            var extension = source.FileName.Split('.').Last();
            return extension == "xls" || extension == "xlsx" || extension == "csv";
        }

        #region Mapping Helper

        private IDictionary<int, T> GetFinalMapping<T>(IDictionary<string, int> columnMapping, IDictionary<string, T> setterMapping)
        {
            var dictionary = new Dictionary<int, T>(columnMapping.Count);

            foreach (var mapping in columnMapping)
            {
                try
                {
                    dictionary.Add(mapping.Value, setterMapping[mapping.Key]);
                }
                catch (KeyNotFoundException)
                {
                    throw new KeyNotFoundException("invalid column " + mapping.Key);
                }
            }

            return dictionary;
        }

        private IDictionary<string, int> GetColumnsMapping(ISheet sheet)
        {
            var lastColumn = sheet.GetRow(0).Cells.Count;
            var dictionary = new Dictionary<string, int>(lastColumn);

            for (int i = 0; i < lastColumn; ++i)
            {
                dictionary.Add(sheet.GetRow(0).GetCell(i).StringCellValue, i);
            }

            return dictionary;
        }

        #endregion Mapping Helper
    }
}