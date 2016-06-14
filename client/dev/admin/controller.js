(function () {
    'use strict';

angular.module('campfire-client')
    .filter('filterByPhrase', function() {
        return function(items, phrase) {
            var filtered = [];
            angular.forEach(items, function(item) {
                if(phrase.length>0) {
                    console.log("Changed");
                } else {
                    filtered.push(item);
                }
            });
            return filtered;
        };
    })
    .controller('adminCtrl', function (
        $routeParams, $scope,
        Version
    ) {
        var vm = this;
        vm.versions = [];
        vm.hasVersions = false;
        vm.loading = false;
        vm.filterPhrase = '';

        vm.addPostToVersion = function(version) {
            version.addPost();
        };

        vm.initialize = function () {
            vm.loading = true;
            Version.getAll().then(function(result){
                vm.versions = result;
                vm.hasVersions = vm.versions.length > 0 ? true : false;
                vm.loading = false;
            });
            activateMaterialize("Version controller");
        };

        vm.initialize();
    });
})();