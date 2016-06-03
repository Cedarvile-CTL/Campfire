(function () {
    'use strict';

    angular.module('campfire-client').directive('campfire-post', function(){
        return {
            replace:true,
            scope: {},
            bindToController: {
                post: "="
            },
            restrict: "E",
            templateUrl: "./client/dev/post/view.html",
            controller: ["$scope", PostCtrl],
            controllerAs: "post"
        };
    });

    function PostCtrl($scope) {
        var vm = this;

        vm.initialize = function () {
            activateMaterialize("Post directive");
            vm.id = vm.post.id;
            vm.user = vm.post.user;
            vm.body = vm.post.body;
            vm.posts = vm.post.posts;
        };

        vm.initialize();
    }
})();