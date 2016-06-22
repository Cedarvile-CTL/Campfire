(function () {
    'use strict';

    angular.module('campfire-client').directive('campfireScaleCustom', function(){
        return {
            replace:true,
            scope: {},
            bindToController: {
                scale: "="
            },
            restrict: "E",
            templateUrl: "/apps/campfire/client/dev/scale/custom/view.html",
            controller: ["$scope", "User", ScaleCustomCtrl],
            controllerAs: "scale"
        };
    });

    function ScaleCustomCtrl($scope, User) {
        var vm = this;

        vm.initialize = function () {

        };

        vm.initialize();
    }

})();