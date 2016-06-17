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
            templateUrl: "/apps/campfire/client/dev/thread/view.html",
            controller: ["$scope", "Thread", ThreadCtrl],
            controllerAs: "thread"
        }; 
    });

    function ThreadCtrl($scope, Thread) {
        var vm = this;

        vm.posts = [];
        vm.hasPosts = false;
        vm.loading = false;

        vm.addPost = function(e) {
            console.log("Clicked to add a post");
            var threadElement = $(e.target).closest(".thread");
            if (threadElement.hasClass("active")) {
                e.stopPropagation(e);
            }
            vm.loading = true;
            vm.thread.addPost(vm.sectionId).then(function(result){
                vm.hasPosts = true;
                vm.loading = false;
            });
        };
        
        vm.childDeleted = function(e, data) {
            if (_.includes(vm.posts, data.post)) {
                e.stopPropagation();
                _.pull(vm.posts, data.post);
                var msg = "Post deleted successfully.";
                if (data.isNew) {
                    msg = "Post cancelled.";
                }
                Materialize.toast(msg, 3000);
            }
        };

        vm.edit = function (e) {
            if (!vm.adminEditing) {
                return false;
            }
            $scope.$emit("thread:edit", { thread: vm.thread });
        };

        vm.getPosts = function() {
            if (vm.adminEditing) {
                return false;
            }
            vm.thread.getPosts().then(function(result){
                vm.posts = result;
                vm.hasPosts = vm.posts.length > 0;
            });
        };
        
        vm.initialize = function () {
            activateMaterialize("Thread directive");
            vm.id = vm.thread.id;
            vm.label = vm.thread.label;
            vm.description = vm.thread.description;
            vm.posts = vm.thread.posts;
            vm.adminEditing = vm.thread.adminEditing;

            console.log(vm.adminEditing);
            
            $scope.$on("post:delete", vm.childDeleted);
        };

        vm.initialize();
    }
})();