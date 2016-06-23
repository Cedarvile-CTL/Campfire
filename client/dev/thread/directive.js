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

        vm.scaleTypeCredit = 1;
        vm.scaleTypeNumeric = 2;
        vm.scaleId = null;
        vm.scaleLabel = "";
        vm.scaleMaxPoints = "";
        vm.scaleType = "";
        vm.isScaleMaxPointsActive = vm.scaleLabel.length > 0;
        vm.isScaleLabelActive = vm.scaleMaxPoints.length > 0;

        vm.addPost = function(e) {
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

        vm.cancelScaleEdit = function() {
            vm.setupEditScaleModal();
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
            vm.hasPosts = vm.posts.length > 0;
        };

        vm.edit = function (e) {
            if (!vm.adminEditing) {
                return false;
            }
            $scope.$emit("thread:edit", { thread: vm.thread });
        };

        vm.editScale = function () {
            if (!vm.thread.scale) {
                vm.thread.scale = new Scale();
            }
            vm.setupEditScaleModal(
                vm.thread.scale.id,
                vm.thread.scale.label,
                vm.thread.scale.maxPoints,
                vm.thread.scale.scaleType
            );
            $("#modal-edit-scale-" + vm.thread.id).openModal();
        };

        vm.delete = function (e) {
            if (!vm.adminEditing) {
                return false;
            }
            $scope.$emit("thread:delete", { thread: vm.thread });
        };

        vm.clone = function (e) {
            if (!vm.adminEditing) {
                return false;
            }
            $scope.$emit("thread:clone", { thread: vm.thread });
        };

        vm.getPosts = function() {
            if (vm.adminEditing) {
                return false;
            }
            vm.thread.getPosts().then(function(result){
                vm.posts = vm.thread.posts;
                vm.hasPosts = vm.posts.length > 0;
            });
        };
        
        vm.initialize = function () {
            activateMaterialize("Thread directive");
            vm.setThreadValues(vm.thread);

            $scope.$on("post:delete", vm.childDeleted);
            $scope.$on("thread:updated", vm.updateThread);
            $scope.$on("post:cancelnew", vm.cancelAddPost);
        };

        vm.setThreadValues = function(data) {
            vm.id = data.id;
            vm.label = data.label;
            vm.description = data.description;
            vm.posts = data.posts;
            vm.adminEditing = data.adminEditing;
        };

        vm.updateThread = function(e, data){
            if (data.id === vm.thread.id) {
                vm.setThreadValues(data);
            }
        };

        vm.setupEditScaleModal = function(scaleId, label, maxPoints, scaleType) {
            vm.scaleId = (scaleId === undefined || scaleId === null)
                ? 0 : scaleId;
            vm.scaleLabel = (label === undefined || label === null)
                ? '' : label;
            vm.scaleMaxPoints = (maxPoints === undefined || maxPoints === null)
                ? '' : maxPoints;
            vm.scaleType = (scaleType === undefined || scaleType === null)
                ? '' : scaleType;
            vm.isScaleMaxPointsActive = vm.scaleMaxPoints > 0;
            vm.isScaleLabelActive = vm.scaleLabel.length > 0;
        };

        vm.saveScale = function() {

        };

        vm.initialize();
    }
})();