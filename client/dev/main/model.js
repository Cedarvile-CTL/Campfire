(function () {
    'use strict';

    angular.module('campfire-client').factory('Main', function ($q, $http, service, Forum) {

        var Main = function () {};

        Main.prototype = {
            forums: []
        };

        Main.forums = [];

        Main.getForumsForVersion = function(versionID) {
            var d = $q.defer();
            $http.get('api/forum/all_for_version/' + versionID).then(function (result) {
                var data = Forum.transformer(result.data);
                d.resolve(data);
            });
            return d.promise;
        };

        return Main;
    });
})();