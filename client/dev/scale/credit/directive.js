(function () {
    'use strict';

    angular.module('campfire-client').directive('campfireScaleCredit', function(){
        return {
            replace:true,
            scope: {},
            bindToController: {
                post: "="
            },
            restrict: "E",
            templateUrl: "/apps/campfire/client/dev/scale/credit/view.html",
            controller: ["$scope", "$interval", "User", ScaleCreditCtrl],
            controllerAs: "vm"
        };
    });

    function ScaleCreditCtrl($scope, $interval, User) {
        var vm = this;

        vm.initialize = function () {
            vm.scale = vm.post.scale;
            $interval(function(){
                console.log("Checking...");
                $(".dropdown-button").dropdown({
                    constrain_width: false,
                    hover: true,
                    alignment: 'right',
                    belowOrigin: true
                });
            }, 500, 1);
        };

        vm.setScore = function(score, e) {
            vm.post.scale.setScore(score);
            $scope.$emit("scale:setScore", vm.post.scale.score);
        };


        vm.initialize();
    }

})();