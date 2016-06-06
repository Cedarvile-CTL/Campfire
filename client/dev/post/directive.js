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

        vm.initialize = function () {
            angular.forEach(vm.post, function(val, key){
                vm[key] = val;
            });
            console.log(vm);
            activateMaterialize("Post directive: " + vm.id);
        };

        vm.initialize();
    }
})();