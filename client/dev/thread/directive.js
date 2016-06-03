(function () {
    'use strict';

    angular.module('campfire-client').directive('campfireThread', function(){
        return {
            replace:true,
            scope: {},
            bindToController: {
                thread: "="
            },
            restrict: "E",
            templateUrl: "./client/dev/thread/view.html",
            controller: ["$scope", ThreadCtrl],
            controllerAs: "thread"
        }; 
    });

    function ThreadCtrl($scope) {
        var vm = this;

        vm.initialize = function () {
            activateMaterialize("Thread directive");
            vm.id = vm.thread.id;
            vm.label = vm.thread.label;
            vm.description = vm.thread.description;
            vm.posts = vm.thread.posts; 
        };

        vm.initialize();
    }
})();