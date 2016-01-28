// --------------------------------------------------------------------------
// <copyright file="FileObjectMapper.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Simon.Huynh" date="2015.1.25">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Core.ExcelUtility.ExcelIOExtensions
{
    using System.Collections.Generic;
    using System.IO;

    public abstract class FileObjectMapper<TSource>
    {
        public abstract IEnumerable<T> Read<T>(TSource source) where T : new();

        public abstract Stream Write<T>(IEnumerable<T> objs);

        protected abstract bool Validate(TSource source);
    }
}