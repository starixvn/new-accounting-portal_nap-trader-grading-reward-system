// --------------------------------------------------------------------------
// <copyright file="DateTimeExtensions.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.6.13">Created</change>
// </history>

namespace Fanex.NAP.Core.Web
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// Contains date extension methods.
    /// </summary>
    public static class IEnumerableExtensions
    {
        public static IEnumerable<IEnumerable<T>> Batch<T>(
   this IEnumerable<T> source, int batchSize)
        {
            int currentSkip = 0;
            while (source.Skip(currentSkip).Take(batchSize).Any())
            {
                yield return source.Skip(currentSkip).Take(batchSize);
                currentSkip += batchSize;
            }
        }
    }
}