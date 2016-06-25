(function () {
    'use strict';

    angular.module('campfire-client').directive('campfirePost', function(){
        return {
            replace:true,
            scope: {},
            bindToController: {
                post: "="
            },
            restrict: "E",
            templateUrl: "/apps/campfire/client/dev/post/view.html",
            controller: ["$scope", "$interval", "Post", "Scale", "User", PostCtrl],
            controllerAs: "post"
        };
    });

    function PostCtrl($scope, $interval, Post, Scale, User) {
        var vm = this;

        vm.isCreditScale = false;
        vm.isNumericScale = false;
        vm.isCustomScale = false;

        vm.graderViewing = false;
        vm.studentViewing = false;

        vm.edit = function(id, e) {
            vm.loading = true;
            vm.editing = true;
            vm.interval = $interval(vm.checkForEditableArea, 250);
        };
        vm.cancel = function(e) {
            e.preventDefault();
            vm.editing = vm.post.editing = false;
            if (vm.post.isNew) {
                vm.delete(e);
            }
        };
        vm.cancelDelete = function(e) {
            e.preventDefault();
        };
        vm.checkForEditableArea = function(){
            var postId = "#post-" + vm.post.id;
            var elem = $(postId + "-body");
            if (elem.length > 0) {
                $interval.cancel(vm.interval);
                tinyMCEInit("#" + elem.attr("id"));
                vm.loading = false;
            }
        };
        vm.delete = function(id, e) {
            if (e) {
                e.preventDefault();
            }
            var isNew = vm.post.isNew;
            vm.post.delete().then(function () {
                $scope.$emit("post:delete", { post: vm.post, isNew:isNew });
            });
        };
        vm.reply = function(id, e) {
            vm.loading = true;
            vm.post.addReply().then(function(result){
                vm.hasPosts = vm.post.hasPosts = true;
                vm.loading = false;
            });
        };
        vm.save = function(e) {
            e.preventDefault();
            vm.loading = true;
            var postId = "#post-" + vm.post.id;
            var data = {
                body: $(postId + "-body").val(),
                date_updated: Date.today().setTimeToNow()
            };
            vm.post.save(data).then(function(result){
                angular.forEach(vm.post, function(val, key){
                    vm[key] = val;
                });
                vm.loading = false;
                vm.editing = vm.post.editing = false;
                Materialize.toast("Post saved successfully.", 3000);
            });
        };

        vm.saveScore = function(e, score) {
            vm.post.saveScore(score);
        };

        vm.toggleVisibility = function(id, e) {
            // console.log("Toggling visibility of post " + id);
        };

        vm.initialize = function () {
            angular.forEach(vm.post, function(val, key){
                vm[key] = val;
            });
            vm.loading = false;
            vm.graderViewing = vm.post.scale.graderViewing;
            vm.authorViewing = vm.post.authorViewing;
            activateMaterialize("Post directive: " + vm.id);
            if (vm.editing) {
                vm.edit();
            }

            $('.modal-trigger').leanModal();

            vm.isCreditScale = Number(vm.scale.type.id) === Scale.creditScale;
            vm.isNumericScale = Number(vm.scale.type.id) === Scale.numericScale;
            vm.isCustomScale = Number(vm.scale.type.id) === Scale.customScale;

            $scope.$on("post:delete", vm.childDeleted);
            $scope.$on("scale:setScore", vm.saveScore); 
        };

        vm.childDeleted = function(e, data) {
            if (_.includes(vm.post.posts, data.post)) {
                e.stopPropagation();
                _.pull(vm.post.posts, data.post);
                var msg = "Post deleted successfully.";
                if (data.isNew) {
                    msg = "Post cancelled.";
                }
                Materialize.toast(msg, 3000);
            }
        };

        vm.initialize();
    }

})();