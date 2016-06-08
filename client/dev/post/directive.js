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
            controller: ["$scope", "Post", PostCtrl],
            controllerAs: "post"
        };
    });

    function PostCtrl($scope, Post) {
        var vm = this;

        vm.edit = function(id, e) {
            console.log("Editing post " + id);
            var postItem = $(e.target).closest(".post");
            var postId = "#" + postItem.attr("id");
            tinyMCEInit(postId + "-body");
            vm.editing = true;
        };
        vm.delete = function(id, e) {
            console.log("Deleting post " + id);
        };
        vm.reply = function(id, e) {
            console.log("Replying to post " + id);
        };
        vm.save = function(e) {
            e.preventDefault();
            var postItem = $(e.target).closest(".post");
            var postId = "#" + postItem.attr("id");
            var data = {
                body: $(postId + "-body").val()
            };
            vm.post.save(data);
        };
        vm.toggleVisibility = function(id, e) {
            console.log("Toggling visibility of post " + id);
        };

        vm.initialize = function () {
            angular.forEach(vm.post, function(val, key){
                vm[key] = val;
            });
            activateMaterialize("Post directive: " + vm.id);
        };

        vm.initialize();
    }
})();