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
            controller: ["$scope", "$timeout", "Thread", "Scale", ThreadCtrl],
            controllerAs: "thread"
        }; 
    });

    function ThreadCtrl($scope, $timeout, Thread, Scale) {
        var vm = this;

        vm.posts = [];
        vm.hasPosts = false;
        vm.loading = false;

        vm.versionScales = [];

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

        vm.addScale = function() {
            vm.editScale(true);
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

        vm.editScale = function (newScale) {
            newScale = newScale === undefined ? false : newScale;
            console.log(newScale, vm.thread.scale);
            if (newScale || !vm.thread.scale) {
                vm.thread.scale = new Scale();
                vm.thread.scale.version = vm.thread.version;
            }
            vm.setupEditScaleModal(
                vm.thread.scale.id,
                vm.thread.scale.label,
                vm.thread.scale.maxPoints,
                vm.thread.scale.type.id
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
        
        vm.getVersionScales = function(e) {
            e.preventDefault();
            Scale.getVersionScales(vm.thread.version).then(function(result){
                vm.versionScales = result;
                console.log(vm.versionScales);
            });
        };
        
        vm.initialize = function () {
            activateMaterialize("Thread directive");
            vm.setThreadValues(vm.thread);

            $scope.$on("post:delete", vm.childDeleted);
            $scope.$on("thread:updated", vm.updateThread);
            $scope.$on("post:cancelnew", vm.cancelAddPost);

            $timeout(function() {
                $("#thread-" + vm.thread.id + " a.dropdown-button").dropdown({
                    constrain_width: false,
                    alignment: 'right'
                });
            }, 500);

        };

        vm.setThreadValues = function(data) {
            vm.id = data.id;
            vm.label = data.label;
            vm.description = data.description;
            vm.posts = data.posts;
            vm.adminEditing = data.adminEditing;
            vm.scale = data.scale;
        };

        vm.updateThread = function(e, data){
            if (data.id === vm.thread.id) {
                vm.setThreadValues(data);
            }
        };

        vm.updateScale = function(scaleId, e) {
            vm.thread.updateScale(scaleId).then(function(result){
                vm.scale = vm.thread.scale;
            });
        };

        vm.setupEditScaleModal = function(scaleId, label, maxPoints, scaleType) {
            vm.scaleId = (scaleId === undefined || scaleId === null) ? 0 : scaleId;
            vm.scaleLabel = (label === undefined || label === null) ? '' : label;
            vm.scaleMaxPoints = (maxPoints === undefined || maxPoints === null) ? '' : maxPoints;
            vm.scaleType = (scaleType === undefined || scaleType === null) ? 1 : Number(scaleType);
            vm.isScaleMaxPointsActive = vm.scaleMaxPoints > 0;
            vm.isScaleLabelActive = vm.scaleLabel.length > 0;
        };

        vm.saveScale = function() {
            vm.thread.scale.save({
                id: vm.scaleId,
                label: vm.scaleLabel,
                maxPoints: vm.scaleMaxPoints,
                type: vm.scaleType
            }).then(function(result){
                vm.thread.updateScale(result.id).then(function(result){
                    console.log("Updated:", vm.thread.scale);
                    vm.scale = vm.thread.scale;
                });

            });
        };

        vm.initialize();
    }
})();