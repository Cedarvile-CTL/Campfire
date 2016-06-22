(function () {
    'use strict';

    angular.module('campfire-client').directive('campfireScaleNumeric', function(){
        return {
            replace:true,
            scope: {},
            bindToController: {
                scale: "="
            },
            restrict: "E",
            templateUrl: "/apps/campfire/client/dev/scale/numeric/view.html",
            controller: ["$scope", "User", ScaleNumericCtrl],
            controllerAs: "scale"
        };
    });

    function ScaleNumericCtrl($scope, User) {
        var vm = this;

        vm.initialize = function () {

        };

        vm.initialize();
    }

})();