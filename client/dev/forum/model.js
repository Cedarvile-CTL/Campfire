(function () {
    'use strict';

    angular.module('campfire-client').factory('Forum', function ($q, $http, Thread) {

        var forums = [];

        var Forum = function (id, label, description, threads) {
            this.id = id;
            this.label = label;
            this.description = description;
            this.threads = Thread.transformer(threads);
        };

        Forum.prototype = {

        };

        Forum.get = function(forumId) {
            var d = $q.defer();
            $http.get('api/forum/get/' + forumId).then(function (result) {
                var data = Forum.transformer(result.data);
                d.resolve(data);
            });
            return d.promise;
        };

        Forum.getList = function(options) {
            var d = $q.defer();
            $http.get('api/forum/get_list', options).then(function (result) {
                var data = Forum.transformer(result.data);
                d.resolve(data);
            });
            return d.promise;
        };

        // static methods
        Forum.build = function (data) {
            if (data) {
                return new Forum(
                    data.id,
                    data.label,
                    data.description,
                    data.threads
                );
            }
            return new Forum();
        };

        Forum.transformer = function (data) {
            if (angular.isArray(data)) {
                return data.map(Forum.build);
            }
            return Forum.build(data);
        };

        return Forum;
    });
})();