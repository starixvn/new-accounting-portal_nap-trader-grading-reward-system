// --------------------------------------------------------------------------
// <copyright file="GlobalSuppressions.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.7.30">Created</change>
// </history>

// This file is used by Code Analysis to maintain SuppressMessage 
// attributes that are applied to this project. 
// Project-level suppressions either have no target or are given 
// a specific target and scoped to a namespace, type, member, etc. 

using System.Diagnostics.CodeAnalysis;

[assembly: SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Scope = "member",
    Target = "Fanex.NAP.TGRS.Reports.Services.IDetailReportService.#GetBetTypes()",
    Justification = "Need to review here.")]
[assembly: SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Scope = "member",
    Target = "Fanex.NAP.TGRS.Reports.Services.IDetailReportService.#GetTeams()",
    Justification = "Need to review here.")]
