(function () {
    'use strict';

    angular.module('campfire-client').factory('Forum', function ($q, $http) {

        var forums = [];

        var Forum = function (id, label, description, threads) {
            this.id = id;
            this.label = label;
            this.description = description;
            this.threads = threads;
        };

        Forum.prototype = {

        };

        Forum.service = {
            getAll: function(courseVersion) {
                var d = $q.defer();
                $http.get('api/forum/all_for_version/' + courseVersion).then(function (data) {
                    d.resolve(data);
                });
                return d.promise;
            }
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

        Forum.getAll = function(courseVersion) {
            Forum.service.getAll(courseVersion).then(function(result){
                forums = Forum.transformer(result.data);
            });
            return forums;
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