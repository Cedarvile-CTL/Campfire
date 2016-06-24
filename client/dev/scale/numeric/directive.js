(function () {
    'use strict';

    angular.module('campfire-client').directive('campfireScaleNumeric', function(){
        return {
            replace:true,
            scope: {},
            bindToController: {
                post: "="
            },
            restrict: "E",
            templateUrl: "/apps/campfire/client/dev/scale/numeric/view.html",
            controller: ["$scope", "$interval", "User", ScaleNumericCtrl],
            controllerAs: "vm"
        };
    });

    function ScaleNumericCtrl($scope, $interval, User) {
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