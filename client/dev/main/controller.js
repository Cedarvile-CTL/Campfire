(function () {
    'use strict';

    angular.module('campfire-client').controller('mainCtrl', function (
        $scope, Main, Forum
    ) {
        var vm = this;

        vm.courseVersion = {
            id: 1
        };

        vm.label = "Forums";
        vm.forums = [];
        vm.hasForums = false;

        var initialize = function () {
            Main.getForumsForActiveSection().then(function(result){
                vm.forums = result;
                if (vm.forums.length>0) {
                    vm.hasForums = true;
                }
            });
        };

        initialize();
    });
})(); 