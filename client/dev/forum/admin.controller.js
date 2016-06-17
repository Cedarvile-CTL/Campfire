(function () {
    'use strict';


// Current password: project5508category

    angular.module('campfire-client').controller('forumAdminCtrl', function (
        $routeParams, $scope,
        Forum
    ) {
        var vm = this;
        vm.loading = false;
        vm.forumId = null;
        vm.forum = {};
        vm.hasThreads = false;
        vm.isLabelActive = false;
        vm.isDescriptionActive = false;
        vm.adminEditing = true;

        $scope.init = function(forumId) {
            vm.forumId = forumId;
            vm.initialize();
        };

        vm.initialize = function () {
            vm.loading = true;
            Forum.get(vm.forumId, vm.adminEditing).then(function(result){
                vm.forum = result;
                vm.hasThreads = vm.forum.threads.length > 1 ? true : false;
                vm.loading = false;
                if (vm.hasThreads) {
                    angular.forEach(vm.forum.threads, function(thread, key) {
                        console.log(thread);
                        thread.adminEditing = vm.adminEditing;
                    });
                }
                activateMaterialize("Forum controller");
            });
            $scope.$on("thread:edit", vm.openThreadEditor);
        };

        vm.editForum = function() {
            vm.isLabelActive = vm.forum.label.length > 0;
            vm.isDescriptionActive = vm.forum.description.length > 0;
            $("#modal-edit-forum").openModal();
        };

        vm.openThreadEditor = function(e, data) {
            console.log("Editing thread: ", data.thread);
        };
        
        vm.saveForum = function(e) {
            e.preventDefault();
            vm.forum.save().then(function(){
                $("#forum-label").text(vm.forum.label);
                $("#forum-description").text(vm.forum.description);
            });
        };

        vm.getPosts = function(e){};

        // vm.initialize();
    });
})();