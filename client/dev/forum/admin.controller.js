(function () {
    'use strict';


// Current password: project5508category

    angular.module('campfire-client').controller('forumAdminCtrl', function (
        $routeParams, $scope,
        Forum, Thread
    ) {
        var vm = this;
        vm.loading = false;
        vm.forumId = null;
        vm.forum = {};
        vm.hasThreads = false;
        vm.isLabelActive = false;
        vm.isDescriptionActive = false;
        vm.adminEditing = true;
        vm.isThreadLabelActive = false;
        vm.isThreadDescriptionActive = false;
        vm.activeThreadId = 0;
        vm.activeThreadLabel = "";
        vm.activeThreadDescription = "";
        vm.activeThreadForum = 0;

        $scope.init = function(forumId) {
            vm.forumId = forumId;
            vm.initialize();
        };

        vm.initialize = function () {
            vm.loading = true;
            Forum.get(vm.forumId, vm.adminEditing).then(function(result){
                vm.forum = result;
                vm.hasThreads = vm.forum.threads.length > 1;
                vm.loading = false;
                if (vm.hasThreads) {
                    angular.forEach(vm.forum.threads, function(thread, key) {
                        thread.adminEditing = vm.adminEditing;
                    });
                }
                activateMaterialize("Forum controller");
            });
            $scope.$on("thread:edit", vm.editThread);
            $scope.$on("thread:clone", vm.cloneThread);
            $scope.$on("thread:delete", vm.confirmDeleteThread);
        };

        vm.editForum = function() {
            vm.isLabelActive = vm.forum.label.length > 0;
            vm.isDescriptionActive = vm.forum.description.length > 0;
            $("#modal-edit-forum").openModal();
        };

        vm.editThread = function(e, data) {
            vm.setupEditThreadModal(
                data.thread.forum,
                data.thread.id,
                data.thread.label,
                data.thread.description
            );
            $("#modal-edit-thread").openModal();
        };

        vm.cloneThread = function(e, data) {
            vm.forum.cloneThread(data.thread);
            vm.hasThreads = true;
        };

        vm.confirmDeleteThread = function(e, data) {
            vm.activeThreadId = data.thread.id;
            $("#modal-delete-thread").openModal();
        };

        vm.deleteThread = function(e) {
            vm.forum.deleteThread(vm.activeThreadId);
            vm.activeThreadId = 0;
        };

        vm.addThread = function(e) {
            vm.setupEditThreadModal(vm.forumId);
            $("#modal-edit-thread").openModal();
        };
        
        vm.saveForum = function(e) {
            e.preventDefault();
            vm.forum.save().then(function(){
                $("#forum-label").text(vm.forum.label);
                $("#forum-description").text(vm.forum.description);
            });
        };

        vm.saveThread = function(e) {
            e.preventDefault();
            var thread;
            if (vm.activeThreadId > 0) {
                thread = _.find(vm.forum.threads, { id: vm.activeThreadId });
                thread.adminEditing = vm.adminEditing;
            } else {
                thread = new Thread(null);
                thread.adminEditing = vm.adminEditing;
            }
            thread.save({
                label: vm.activeThreadLabel,
                description: vm.activeThreadDescription,
                forum: vm.activeThreadForum
            }).then(function(result){
                vm.forum.updateThreads(result);
                $scope.$broadcast("thread:updated", result);
            });
        };

        vm.getPosts = function(e){};

        vm.setupEditThreadModal = function(forumId, threadId, label, description) {
            vm.activeThreadForum = (forumId === undefined) ? 0 : forumId;
            vm.activeThreadId = (threadId === undefined) ? 0 : threadId;
            vm.activeThreadLabel = (label === undefined) ? '' : label;
            vm.activeThreadDescription = (description === undefined) ? '' : description;
            vm.isThreadLabelActive = vm.activeThreadLabel.length > 0;
            vm.isThreadDescriptionActive = vm.activeThreadDescription.length > 0;
        };

        // vm.initialize();
    });
})();