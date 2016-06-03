(function () {
    'use strict';


// Current password: project5508category

    angular.module('campfire-client').controller('forumCtrl', function (
        $routeParams, $scope,
        Forum
    ) {
        var vm = this;
        vm.forum = {};

        vm.initialize = function () {
            Forum.get($routeParams.forumId).then(function(result){
                vm.forum = result;
            });
            activateMaterialize("Forum controller");
        };

        vm.getPosts = function(e){

        };

        vm.initialize();
    });
})();