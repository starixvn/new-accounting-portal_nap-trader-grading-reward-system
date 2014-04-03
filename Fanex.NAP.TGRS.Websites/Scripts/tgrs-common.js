/* File Created: April 1, 2014 */
'use strict';

var tgrs = angular.module('tgrs.common', ['ui.bootstrap', 'reCheckIn']);

tgrs.factory('commonService', ['$modal', '$timeout', '$log', function ($modal, $timeout, $log) {
    var commonSericeObj = {};

    // Use to show success/error/warning message.
    var showMessage = function (type, content, autoHide) {
        var modalInstance = null,
            template = '<div data-alert type="\'{0}\'" class="message-popup" close="$close()">{1}</div>';

        type = type || 'warning';
        content = content || '';
        autoHide = autoHide || false;

        modalInstance = $modal.open({
            template: template.format(type, content),
            backdrop: false
        });

        if (autoHide) {
            $timeout(modalInstance.close, 3000);
        }

        return modalInstance;
    };

    // Use to show modal/popup.
    var showModal = function (title, content, controller, showFooter, isModal) {
        var modalInstance = null,
            template = '<div class="modal-header"><h3>{0}</h3></div><div class="modal-body">{1}</div>',
            footer = '<div class="modal-footer">' +
                         '<button class="btn btn-primary" ng-click="ok()">OK</button>' +
                         '<button class="btn btn-warning" ng-click="cancel()">Cancel</button>' +
                     '</div>';

        title = title || '';
        content = content || '';
        isModal = isModal || false;
        controller = controller || function () { };
        template += showFooter ? footer : '';

        modalInstance = $modal.open({
            backdrop: isModal,
            controller: controller,
            template: template.format(title, content)
        });

        return modalInstance;
    };

    commonSericeObj.scope = {};
    commonSericeObj.modalInstance = null;

    commonSericeObj.initialize = function (scope) {
        commonSericeObj.scope = scope;
        $log.debug('init', commonSericeObj.scope);
    };

    commonSericeObj.showErrorMsg = function (content) {
        commonSericeObj.modalInstance = showMessage('danger', content, false);
    };

    commonSericeObj.showSuccessMsg = function (content) {
        commonSericeObj.modalInstance = showMessage('success', content, true);
    };

    commonSericeObj.showWarningMsg = function (content) {
        $log.debug(commonSericeObj);
        commonSericeObj.modalInstance = showMessage('warning', content, false);
    };

    commonSericeObj.showPopup = function (title, content, controller, showFooter) {
        commonSericeObj.modalInstance = showModal(title, content, controller, showFooter, false);
    };

    commonSericeObj.showModal = function (title, content, controller, showFooter) {
        commonSericeObj.modalInstance = showModal(title, content, controller, showFooter, true);
    };

    commonSericeObj.closePopup = function () {
        commonSericeObj.modalInstance.close();
    };

    return commonSericeObj;
} ]);

tgrs.controller('commonController', ['$scope', '$interval', 'reCheckinService', function ($scope, $interval, reCheckinService) {
    $scope.initialize = function (enableReCheckIn, rootUrl) {
        if (enableReCheckIn) {
            reCheckinService.rootUrl = rootUrl;
            $interval(reCheckinService.callReCheckIn, reCheckinService.time);
        }
    };
} ]);

// Register reCheckIn module on 
angular.bootstrap(document.getElementById('divCommon'), ['tgrs.common']);

// Extensions for native javascript objects.
// String Format
/* jshint freeze: false */
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] !== 'undefined' ? args[number] : match;
    });
};