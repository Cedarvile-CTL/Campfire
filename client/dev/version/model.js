(function () {
    'use strict';

    angular.module('campfire-client').factory('Version', function ($q, $http, Forum) {

        var versions = [];

        var Version = function (id, name, courseCode, courseName, programName, numForums, forums) {
            this.id = id;
            this.name = name;
            this.courseCode = courseCode;
            this.courseName = courseName;
            this.programName = programName;
            this.numForums = numForums;
            this.forums = Forum.transformer(forums);
            this.hasForums = this.forums && this.forums.length > 0 ? true : false;
        };

        Version.prototype = {
            cloneForum: function(forum) {
                var version = this;
                var clone = new Forum(null, forum.label, forum.description, forum.version);
                clone.save().then(function(result){
                    version.forums.push(result);
                    version.hasForums = true;
                });
            },
            deleteForum: function(forumId) {
                var version = this;
                var d = $q.defer();
                var forum = _.find(version.forums, { id: forumId });
                if (forum) {
                    console.log("Found forum: ", forum);
                    $http.get('/apps/campfire/api/forum/delete/' + forum.id).then(function (result) {
                        _.remove(version.forums, forum);
                        d.resolve(result);
                    });
                    return d.promise;
                } else {
                    console.log("Couldn't find forum. ", forum);
                }
                return false;
            },
            saveForum: function(data){
                var d = $q.defer();
                var version = this;
                var isNew = false;

                var forum;
                if (data.id > 0) {
                    forum = _.find(version.forums, {id: data.id});
                } else {
                    data.version = version.id;
                    forum = new Forum(null);
                    isNew = true;
                }

                forum.save(data).then(function(result){
                    if (isNew) {
                        version.forums.push(result);
                    }
                    version.hasForums = true;
                    d.resolve(result);
                });
                return d.promise;
            }
        };

        Version.get = function(versionId) {
            var d = $q.defer();
            $http.get('/apps/campfire/api/version/get/' + versionId).then(function (result) {
                var data = Version.transformer(result.data);
                d.resolve(data);
            });
            return d.promise;
        };

        Version.getAll = function() {
            var d = $q.defer();
            $http.get('/apps/campfire/api/version/all').then(function (result) {
                var data = Version.transformer(result.data);
                d.resolve(data);
            }); 
            return d.promise;
        };

        // static methods
        Version.build = function (data) {
            if (data) {
                return new Version(
                    data.versionID ? data.versionID : data.id,
                    data.name,
                    data.courseCode,
                    data.courseName,
                    data.programName,
                    data.num_forums ? data.num_forums : data.numForums,
                    data.forums
                );
            }
            return new Version();
        };

        Version.transformer = function (data) {
            if (angular.isArray(data)) {
                return data.map(Version.build);
            }
            return Version.build(data);
        };

        return Version;
    });
})();