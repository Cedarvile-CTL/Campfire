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
        };

        Version.prototype = {
            addForum: function(){
                
            }
        };

        Version.get = function(versionId) {
            var d = $q.defer();
            $http.get('/apps/campfire/api/version/get/' + versionId).then(function (result) {
                console.log(result.data);
                var data = Version.transformer(result.data);
                d.resolve(data);
            });
            return d.promise;
        };

        Version.getAll = function() {
            var d = $q.defer();
            $http.get('/apps/campfire/api/version/all').then(function (result) {
                var data = Version.transformer(result.data);
                console.log(data);
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