(function () {
    'use strict';


// Current password: project5508category

    angular.module('campfire-client').controller('mainCtrl', function (
        $scope, Main, service, Forum
    ) {
        var vm = this;

        vm.courseVersion = {
            id: 1
        };

        vm.label = "Forums";
        vm.forums = [];

        var initialize = function () {
            Main.getForumsForVersion(vm.courseVersion.id).then(function(result){
                vm.forums = result;
            });
        };

        initialize();
    });
})();