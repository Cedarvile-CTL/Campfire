(function(){
    angular.module('campfire-client').directive('campfireMasthead', function(){
        return {
            replace:true,
            scope: {},
            // bindToController: {
            //     project: "="
            // },
            restrict: "E",
            templateUrl: "./client/dev/masthead/view.html",
            controller: ["$scope", MastheadCtrl],
            controllerAs: "mhead"
        };
    });


    function MastheadCtrl($scope) {

        var vm = this;

        vm.initialize = function() {};

        // =====================================================

        vm.initialize();
    }
})();