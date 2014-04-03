/* File Created: April 3, 2014 */
'use strict';

var userProfile = angular.module('tgrs.userProfile', ['tgrs.common', 'ui.bootstrap.collapse']);

userProfile.controller('userProfileController', ['$scope', function ($scope) {
    $scope.user = {
        firstName: '',
        lastName: '',
        email: ''
    };
    $scope.show = false;

    $scope.initialize = function (firstName, lastName, email) {
        $scope.user.firstName = firstName;
        $scope.user.lastName = lastName;
        $scope.user.email = email;
        $scope.show = true;
    };

    $scope.submitForm = function (isValid) {
        if (!isValid) {
            return;
        }
    };
} ]);