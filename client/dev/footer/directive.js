(function(){
    angular.module('campfire-client').directive('campfireFooter', function(){
        return {
            replace:true,
            scope: {},
            // bindToController: {
            //     project: "="
            // },
            restrict: "E",
            templateUrl: "./client/dev/footer/view.html",
            controller: ["$scope", FooterCtrl],
            controllerAs: "foot"
        };
    });


    function FooterCtrl($scope) {

        var vm = this;

        vm.initialize = function() {};

        // =====================================================

        vm.initialize();
    }
})();