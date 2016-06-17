(function () {
    'use strict';

    angular.module('campfire-client').factory('Forum', function ($q, $http, Thread) {

        var forums = [];

        var Forum = function (id, label, description, version, threads) {
            this.update({
                id: id,
                label: label,
                description: description,
                version: version
            });
            this.threads = threads ? Thread.transformer(threads) : [];
            this.loading = false;
        };

        Forum.prototype = {
            modelProps: [
                'id', 'label', 'description', 'version'
            ],
            deleteThread: function(threadId){
                var forum = this;
                var thread = _.find(this.threads, { id: threadId });
                Thread.delete(threadId).then(function(result){
                    _.pull(forum.threads, thread);
                });
            },
            updateThreads: function(thread) {
                var matchingThread = _.find(this.threads, thread);
                if (matchingThread) {
                    matchingThread.update(thread);
                } else {
                    this.threads.push(thread);
                }
                this.threads = _.sortBy(this.threads, "label");
            },
            getThreads: function() {
                var d = $q.defer();
                var forum = this;
                forum.loading = true;
                Thread.getList({
                    forum: forum.id
                }).then(function(result){
                    forum.threads = Thread.transformer(result.data);
                });
                return d.promise;
            },
            save: function(form_data) {
                var forum = this;
                angular.forEach(form_data, function(val, key){
                    if (_.includes(forum.modelProps, key)) {
                        forum[key] = val;
                    }
                });

                var url = '/apps/campfire/api/forum/save';

                var data = {
                    label: this.label,
                    description: this.description
                };

                if (this.id === null || this.id === 0) {
                    console.log("New forum");
                    data.version = this.version;
                } else {
                    console.log("Edit forum");
                    url += "/" + this.id;
                }

                var d = $q.defer();
                forum.loading = true;
                $http.post(url, data).then(function (result) {
                    forum.update(result.data);
                    forum.loading = false;
                    d.resolve(forum);
                });
                return d.promise;
            },
            update: function(data) {
                this.id = data.id;
                this.label = data.label;
                this.description = data.description;
                this.version = data.version;
            }
        };

        Forum.get = function(forumId, isAdmin) {
            isAdmin = typeof isAdmin !== 'undefined' ? isAdmin : false;
            var isAdminParam = isAdmin ? '1' : '0';
            var d = $q.defer();
            var url = '/apps/campfire/api/forum/get/' + forumId + '/' + isAdminParam;
            $http.get(url).then(function (result) {
                var data = Forum.transformer(result.data);
                d.resolve(data);
            });
            return d.promise;
        };

        Forum.getList = function(options) {
            var d = $q.defer();
            $http.get('/apps/campfire/api/forum/get_list', options).then(function (result) {
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
                    data.version,
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