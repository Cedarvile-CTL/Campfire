(function () {
    'use strict';

    angular.module('campfire-client').factory('Post', function ($q, $http, User) {

        var Post = function (id, body, posts, user, date_posted, date_updated) {
            this.id = id;
            this.update({
                body: body,
                posts: posts,
                user: user,
                date_posted: date_posted,
                date_updated: date_updated
            });
            this.isMine = this.user.id === User.activeUser.id;
            this.notMine = !this.isMine;
            this.editing = false;
        };

        Post.prototype = {
            modelProps: [
                "id", "body", "user",
                "date_posted", "date_updated",
                "section", "parent"
            ],
            save: function(form_data) {
                var post = this;
                angular.forEach(form_data, function(val, key){
                    if (_.includes(post.modelProps, key)) {
                        post[key] = val;
                    }
                });
                var url = 'api/post/save';

                var data = {
                    body: this.body,
                    date_updated: this.date_udpated
                };

                if (!this.id > 0) {
                    console.log("New post; add extra data");
                    data.date_posted = this.date_updated;
                    data.user = this.user.id;
                    data.section = this.section.id;
                    data.parent = this.parent;
                } else {
                    console.log("Update to existing post; keep it simple but add Id to API path");
                    url += "/" + this.id;
                }

                var d = $q.defer();
                $http.post(url, data).then(function (result) {
                    post.update(result.data);
                    d.resolve(post);
                });
                return d.promise;
            },
            update: function(data) {
                this.body = data.body;
                this.user = User.transformer(data.user);
                this.date_posted = Date.parse(data.date_posted);
                this.date_updated = Date.parse(data.date_updated);
                this.posts = angular.isArray(data.posts) ? Post.transformer(data.posts) : [];
            }
        };

        Post.get = function(postId) {
            var d = $q.defer();
            $http.get('api/post/get/' + postId).then(function (result) {
                var data = Post.transformer(result.data);
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
                    data.id,
                    data.body,
                    data.posts,
                    data.user,
                    data.date_posted,
                    data.date_updated
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