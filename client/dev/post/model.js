(function () {
    'use strict';

    angular.module('campfire-client').factory('Post', function ($q, $http, User) {

        var Post = function (id, body, posts, user, date_posted, date_updated, parent, section, thread) {
            this.update({
                id: id,
                body: body,
                user: user,
                date_posted: date_posted,
                date_updated: date_updated
            });
            this.parent = parent;
            this.section = section;
            this.thread = thread;
            this.posts = angular.isArray(posts) ? Post.transformer(posts) : [];
            this.hasPosts = this.posts.length > 0 ? true : false;
            this.isMine = this.user.id === User.activeUser.id;
            this.notMine = !this.isMine;
            this.editing = false;
            console.log(this);
        };

        Post.prototype = {
            modelProps: [
                "id", "body", "user",
                "date_posted", "date_updated",
                "section", "parent"
            ],
            addReply: function() {
                var d = $q.defer();
                var post = this;
                var newPost = new Post(
                    null,
                    "",
                    [],
                    User.activeUser,
                    Date.today().setTimeToNow(),
                    Date.today().setTimeToNow(),
                    post.id,
                    post.section,
                    post.thread
                );
                console.log(newPost);
                newPost.save({
                    body: ""
                }).then(function (result) {
                    result.editing = true;
                    post.posts.unshift(result);
                    d.resolve(result);
                });
                return d.promise;
            },
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
                    date_updated: Date.parse(this.date_updated).toString('u').replace("Z", "")
                };

                if (this.id === null || this.id === 0) {
                    // console.log("New post; add extra data");
                    data.date_posted = data.date_updated;
                    data.user = this.user.id;
                    data.section = this.section;
                    data.parent = this.parent;
                    data.thread = this.thread;
                } else {
                    // console.log("Update to existing post; keep it simple but add Id to API path");
                    url += "/" + this.id;
                }
                // console.log(data);
                var d = $q.defer();
                post.loading = true;
                $http.post(url, data).then(function (result) {
                    post.update(result.data);
                    d.resolve(post);
                    post.loading = false;
                });
                return d.promise;
            },
            update: function(data) {
                this.id = data.id;
                this.body = data.body;
                if (data.user instanceof User) {
                    this.user = data.user;
                } else {
                    this.user = User.transformer(data.user);
                }
                this.date_posted = Date.parse(data.date_posted);
                this.date_updated = Date.parse(data.date_updated);
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
                    data.date_updated,
                    data.parent,
                    data.section,
                    data.thread
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