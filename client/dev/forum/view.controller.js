(function () {
    'use strict';


// Current password: project5508category

    angular.module('campfire-client').controller('forumCtrl', function (
        $routeParams, $scope,
        Forum
    ) {
        var vm = this;
        vm.forumId = null;
        vm.forum = {};
        vm.hasThreads = false;

        $scope.init = function(forumId) {
            vm.forumId = forumId;
            vm.initialize();
        };

        vm.initialize = function () {
            Forum.get(vm.forumId).then(function(result){
                vm.forum = result;
                vm.hasThreads = vm.forum.threads.length > 1 ? true : false;
            });
            activateMaterialize("Forum controller");
        };

        vm.getPosts = function(e){};

        // vm.initialize();
    });
})();