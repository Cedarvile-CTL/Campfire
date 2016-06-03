(function () {
    'use strict';

    angular.module('campfire-client').factory('Post', function ($q, $http) {

        var posts = [];

        var Post = function (id, label, description, threads) {
            // this.id = id;
            // this.label = label;
            // this.description = description;
            // this.threads = threads;
        };

        Post.prototype = {

        };

        Post.get = function(postId) {
            var d = $q.defer();
            $http.get('api/post/get/' + postId).then(function (result) {
                var data = Forum.transformer(result.data);
                d.resolve(data);
            });
            return d.promise;
        };

        Post.getList = function(options) {
            var d = $q.defer();
            $http.get('api/post/get_list', options).then(function (result) {
                var data = Post.transformer(result.data);
                d.resolve(data);
            });
            return d.promise;
        };

        // static methods
        Post.build = function (data) {
            if (data) {
                return new Post(
                    // data.id,
                    // data.label,
                    // data.description,
                    // data.threads
                );
            }
            return new Post();
        };

        Post.transformer = function (data) {
            if (angular.isArray(data)) {
                return data.map(Post.build);
            }
            return Post.build(data);
        };

        return Post;
    });
})();