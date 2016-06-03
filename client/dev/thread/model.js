(function () {
    'use strict';

    angular.module('campfire-client').factory('Thread', function ($q, $http) {

        var threads = [];

        var Thread = function (id, label, description, posts) {
            this.id = id;
            this.label = label;
            this.description = description;
            this.posts = posts;
        };

        Thread.prototype = {

        };

        Thread.get = function(threadId) {
            var d = $q.defer();
            $http.get('api/thread/get/' + threadId).then(function (result) {
                var data = Forum.transformer(result.data);
                d.resolve(data);
            });
            return d.promise;
        };

        Thread.getList = function(options) {
            var d = $q.defer();
            $http.get('api/thread/get_list', options).then(function (result) {
                var data = Thread.transformer(result.data);
                d.resolve(data);
            });
            return d.promise;
        };

        // static methods
        Thread.build = function (data) {
            if (data) {
                return new Thread(
                    data.id,
                    data.label,
                    data.description,
                    data.posts
                );
            }
            return new Thread();
        };

        Thread.transformer = function (data) {
            if (angular.isArray(data)) {
                return data.map(Thread.build);
            }
            return Thread.build(data);
        };

        return Thread;
    });
})();