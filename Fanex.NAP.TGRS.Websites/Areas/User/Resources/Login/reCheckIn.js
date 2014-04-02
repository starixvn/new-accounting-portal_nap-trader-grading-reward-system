/* File Created: April 1, 2014 */
'use strict';

var reCheckIn = angular.module('reCheckIn', ['tgrs.common']);

reCheckIn.factory('reCheckinService', ['$http', '$window', '$timeout', '$log', 'commonService', function ($http, $window, $timeout, $log, commonService) {
    var reCheckInObj = {};

    reCheckInObj.time = 5000,
    reCheckInObj.kickedOutMsg = 'You have logged in from another session or your login session has expired!',
    reCheckInObj.rootUrl = '';
    reCheckInObj.callReCheckIn = function () {
        $http({ method: 'POST', url: reCheckInObj.rootUrl + 'User/Login/ReCheckLogin' }).success(function (data) {
            if (data === '"1"') {
                commonService.showErrorMsg(reCheckInObj.kickedOutMsg);
                $timeout(function () {
                    $window.location.href = reCheckInObj.rootUrl + 'User/Login/LogOut';
                }, 3000);
            } else if (data === '"-1"') {
                $window.location.href = reCheckInObj.rootUrl + 'User/Common/Offline';
            }
        });
    };

    return reCheckInObj;
} ]);

reCheckIn.controller('reCheckInController', ['$scope', '$interval', 'reCheckinService', function ($scope, $interval, reCheckinService) {
    $scope.initialize = function (enableReCheckIn, rootUrl) {
        if (enableReCheckIn) {
            reCheckinService.rootUrl = rootUrl;
            $interval(reCheckinService.callReCheckIn, reCheckinService.time);
        }
    };
} ]);

// Register reCheckIn module on 
angular.bootstrap(document.getElementById('divReCheckIn'), ['reCheckIn']);