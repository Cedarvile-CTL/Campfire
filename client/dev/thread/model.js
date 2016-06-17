(function () {
    'use strict';

    angular.module('campfire-client').factory('Thread', function ($q, $http, Post) {

        var threads = [];

        var Thread = function (id, label, description, forum, posts) {
            this.update({
                id: id,
                label: label,
                description: description, 
                forum: forum
            });
            this.posts = angular.isArray(posts) ? Post.transformer(posts) : [];
            this.adminEditing = false;
        };

        Thread.prototype = {
            addPost: function() {
                var d = $q.defer();
                var thread = this;
                var newPost = Post.new(null, null, thread.id);
                newPost.save({ body: "" }).then(function(result){
                    result.editing = true;
                    result.isNew = true;
                    thread.posts.unshift(result);
                    d.resolve(result);
                });
                return d.promise;
            },
            getPosts: function() {
                var thread = this;
                var d = $q.defer();
                Thread.getPosts(thread.id).then(function(result){
                    thread.posts = result;
                    d.resolve(result);
                });
                return d.promise;
            },
            modelProps: [
                'id', 'label', 'description', 'forum'
            ],
            save: function(form_data) {
                var thread = this;
                angular.forEach(form_data, function(val, key){
                    if (_.includes(thread.modelProps, key)) {
                        thread[key] = val;
                    }
                });

                var url = '/apps/campfire/api/thread/save';

                var data = {
                    label: this.label,
                    description: this.description
                };

                if (this.id === null || this.id === 0) {
                    console.log("New thread");
                    data.forum = this.forum;
                } else {
                    console.log("Edit thread");
                    url += "/" + this.id;
                }

                var d = $q.defer();
                thread.loading = true;
                $http.post(url, data).then(function (result) {
                    thread.update(result.data);
                    thread.loading = false;
                    d.resolve(thread);
                });
                return d.promise;
            },
            update: function(data) {
                this.id = data.id;
                this.label = data.label;
                this.description = data.description;
                this.forum = data.forum;
            }
        };

        Thread.get = function(threadId) {
            var d = $q.defer();
            $http.get('/apps/campfire/api/thread/get/' + threadId).then(function (result) {
                var data = Thread.transformer(result.data);
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
                var data = [];
                if (result.data !== null) {
                    data = Post.transformer(result.data);
                }
                d.resolve(data);
            });
            return d.promise;
        };

        Thread.delete = function (threadId) {
            var d = $q.defer();
            $http.get('/apps/campfire/api/thread/delete/' + threadId).then(function (result) {
                d.resolve(result.data);
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
                    data.forum, 
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