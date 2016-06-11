(function () {
    'use strict';

    angular.module('campfire-client').factory('Thread', function ($q, $http, Post) {

        var threads = [];

        var Thread = function (id, label, description, posts) {
            this.id = id;
            this.label = label;
            this.description = description;
            this.posts = angular.isArray(posts) ? Post.transformer(posts) : [];
        };

        Thread.prototype = {
            getPosts: function() {
                var thread = this;
                var d = $q.defer();
                Thread.getPosts(thread.id).then(function(result){
                    thread.posts = result;
                    d.resolve(result);
                    console.log("Updated thread", thread);
                });
                return d.promise;
            },
            addPost: function(sectionId) {
                var d = $q.defer();
                var thread = this;
                var newPost = Post.new(null, sectionId, thread.id);
                newPost.save({ body: "<p>New post</p>"}).then(function(result){
                    result.editing = true;
                    result.isNew = true;
                    thread.posts.unshift(result);
                    d.resolve(result);
                });
                return d.promise;
            }
        };

        Thread.get = function(threadId) {
            var d = $q.defer();
            $http.get('/apps/campfire/api/thread/get/' + threadId).then(function (result) {
                var data = Forum.transformer(result.data);
                d.resolve(data);
            });
            return d.promise;
        };

        Thread.getList = function(options) {
            var d = $q.defer();
            $http.get('/apps/campfire/api/thread/get_list', options).then(function (result) {
                var data = Thread.transformer(result.data);
                d.resolve(data);
            });
            return d.promise;
        };
        
        Thread.getPosts = function(threadId) {
            var d = $q.defer();
            $http.get('/apps/campfire/api/thread/get_posts/' + threadId).then(function (result) {
                var data = Post.transformer(result.data);
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