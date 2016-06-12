(function () {
    'use strict';

    angular.module('campfire-client').factory('Main', function ($q, $http, Forum) {

        var Main = function () {};

        Main.prototype = {
            forums: []
        };

        Main.forums = [];

        Main.getForumsForVersion = function(versionID) {
            var d = $q.defer();
            $http.get('/apps/campfire/api/forum/all_for_version/' + versionID).then(function (result) {
                var data = Forum.transformer(result.data);
                d.resolve(data);
            });
            return d.promise;
        };

        Main.getForumsForActiveSection = function() {
            var d = $q.defer();
            $http.get('/apps/campfire/api/forum/all_for_section/').then(function (result) {
                var data = [];
                if (result.data) {
                    data = Forum.transformer(result.data);
                }
                d.resolve(data);
            });
            return d.promise;
        };

        return Main;
    });
})();