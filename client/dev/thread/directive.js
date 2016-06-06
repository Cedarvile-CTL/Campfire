(function () {
    'use strict';

    angular.module('campfire-client').directive('campfireThread', function(Thread){
        return {
            replace:true,
            scope: {},
            bindToController: {
                thread: "="
            },
            restrict: "E",
            templateUrl: "./client/dev/thread/view.html",
            controller: ["$scope", "Thread", ThreadCtrl],
            controllerAs: "thread"
        }; 
    });

    function ThreadCtrl($scope, Thread) {
        var vm = this;

        vm.posts = [];
        vm.has_posts = false;

        vm.getPosts = function() {
            vm.thread.getPosts().then(function(result){
                vm.posts = result;
                vm.has_posts = vm.posts.length > 0;
            });
        };
        
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