(function () {
    'use strict';

    angular.module('campfire-client').service('service', function ($q, $http) {
        return {
            getForumsForVersion: function (versionID) {
                var d = $q.defer();
                $http.get('api/forum/all_for_version/' + versionID).then(function (result) {
                    d.resolve(result.data);
                });
                return d.promise;
            }
        };
    });
})();