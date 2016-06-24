(function () {
    'use strict';

    angular.module('campfire-client').directive('campfireScaleCustom', function(){
        return {
            replace:true,
            scope: {},
            bindToController: {
                post: "="
            },
            restrict: "E",
            templateUrl: "/apps/campfire/client/dev/scale/custom/view.html",
            controller: ["$scope", "User", ScaleCustomCtrl],
            controllerAs: "vm"
        };
    });

    function ScaleCustomCtrl($scope, User) {
        var vm = this;

        vm.initialize = function () {
            vm.scale = vm.post.scale;
            vm.score = vm.post.scale.score;
        };

        vm.setScore = function(e) {
            vm.post.scale.setScore(vm.score);
            $scope.$emit("scale:setScore", vm.post.scale.score);
        };

        vm.initialize();
    }

})();