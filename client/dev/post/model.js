(function () {
    'use strict';

    angular.module('campfire-client').factory('Post', function ($q, $http, User) {

        var Post = function (id, body, posts, user, date_posted, date_updated) {
            this.id = id;
            this.body = body;
            this.user = User.transformer(user);
            this.date_posted = Date.parse(date_posted);
            this.date_updated = Date.parse(date_updated);
            this.posts = angular.isArray(posts) ? Post.transformer(posts) : [];
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
            save: function(data) {
                console.log("Saving post " + this.id);
                angular.forEach(this.modelProps, function(property){
                    if (! data.hasOwnProperty(property)) {
                        switch (property)
                        {
                            case "user":
                                data[property] = this.user.id;
                                break;
                            default:
                                data[property] = val;
                                break;
                        }
                    }
                });
                console.log(data);
                var d = $q.defer();
                var url = 'api/post/save';
                    url += this.id > 0 ? "/" + this.id : "";
                // $http.post(url, data).then(function (result) {
                //     var data = Forum.transformer(result.data);
                //     d.resolve(data);
                // });
                // return d.promise;
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