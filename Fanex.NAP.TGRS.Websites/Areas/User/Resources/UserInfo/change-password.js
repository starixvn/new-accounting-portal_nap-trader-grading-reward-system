/* File Created: April 3, 2014 */
'use strict';

var changePassword = angular.module('tgrs.changePassword', ['tgrs.common', 'ui.bootstrap.collapse']);

changePassword.controller(
    'changePasswordController', ['$scope', '$timeout', '$http', '$window', '$log', 'commonService', 'commonConstants',
    function ($scope, $timeout, $http, $window, $log, commonService, commonConstants) {
        $scope.password = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        };
        $scope.errors = [];
        $scope.success = false;
        $scope.showSuccess = $scope.success;

        $scope.$watch('success', function () {
            $scope.showSuccess = $scope.success;
            $timeout(function () {
                $scope.success = false;
                $scope.showSuccess = false;
            }, 5000);
        }, true);

        $scope.cancel = function () {
            $window.location.href = commonConstants.rootUrl;
        };

        $scope.submitForm = function () {
            var updatedPwd = {
                UserPwd: $scope.password.newPassword,
                ConfirmUserPwd: $scope.password.confirmPassword,
                OldUserPwd: $scope.password.oldPassword
            };

            if ($scope.changePassword.$valid) {
                commonService.disableInput();
                $scope.errors = []
                $http.post(commonConstants.rootUrl + 'User/UserInfo/ChangePassword', updatedPwd).success(function (result) {
                    if (result.length === 0) {
                        $scope.success = true;
                    } else {
                        $scope.errors = result;
                    }
                }).error(function (xhr) {
                    commonService.showErrorMsg(commonConstants.internalError);
                }).then(function (result) {
                    commonService.enableInput();
                });
            }
        };
    } ]);