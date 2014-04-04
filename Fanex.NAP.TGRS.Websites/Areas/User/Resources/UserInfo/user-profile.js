/* File Created: April 3, 2014 */
'use strict';

var userProfile = angular.module('tgrs.userProfile', ['tgrs.common', 'ui.bootstrap.collapse']);

userProfile.controller(
    'userProfileController', ['$scope', '$timeout', '$http', '$window', '$log', 'commonService', 'commonConstants',
    function ($scope, $timeout, $http, $window, $log, commonService, commonConstants) {
        $scope.user = {
            firstName: '',
            lastName: '',
            email: '',
            groupId: 0
        };
        $scope.success = false;
        $scope.showMessage = $scope.success;

        $scope.$watch('success', function () {
            $scope.showMessage = $scope.success;
            $timeout(function () {
                $scope.success = false;
                $scope.showMessage = false;
            }, 5000);
        }, true);

        $scope.cancel = function () {
            $window.location.href = commonConstants.rootUrl;
        };

        $scope.submitForm = function () {
            if ($scope.userProfile.$valid) {
                commonService.disableInput();
                $http.post(commonConstants.rootUrl + 'User/UserInfo/UserProfile', $scope.user).success(function (result) {
                    if (result.length === 0) {
                        $scope.success = true;
                    }
                }).error(function (xhr) {
                    commonService.showErrorMsg(commonConstants.internalError);
                }).then(function (result) {
                    commonService.enableInput();
                });
            }
        };
    } ]);