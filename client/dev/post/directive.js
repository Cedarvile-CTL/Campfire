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
            templateUrl: "./client/dev/post/view.html",
            controller: ["$scope", "$interval", "Post", "User", PostCtrl],
            controllerAs: "post"
        };
    });

    function PostCtrl($scope, $interval, Post, User) {
        var vm = this;

        vm.edit = function(id, e) {
            vm.loading = true;
            vm.editing = true;
            vm.interval = $interval(vm.checkForEditableArea, 250);
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
            console.log("Deleting post " + id);
            vm.post.delete().then(function () {
                $("#post-" + id).remove();
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
                vm.editing = false;
            });
        };
        vm.toggleVisibility = function(id, e) {
            // console.log("Toggling visibility of post " + id);
        };

        vm.initialize = function () {
            angular.forEach(vm.post, function(val, key){
                vm[key] = val;
            });
            vm.loading = false;
            activateMaterialize("Post directive: " + vm.id);
            if (vm.editing) {
                vm.edit();
            }
        };

        vm.initialize();
    }

})();