(function () {
    'use strict';

    angular.module('campfire-client').factory('Scale', function ($q, $http, User) {

        var Scale = function (id, type, label, description, maxPoints, version) {
            this.update({
                id: id,
                type: type,
                label: label,
                description: description,
                maxPoints: maxPoints,
                version: version
            });
            this.studentViewing = false;
            this.graderViewing = true;
            this.score = Scale.notGraded;
            this.maxPoints = this.maxPoints ? Number(this.maxPoints) : 1;

            this.max = "MAX";
            this.min = "MIN";
            this.none = "NONE";
        };

        Scale.prototype = {
            update: function(data) {
                this.id = data.id;
                this.type = data.type;
                this.label = data.label;
                this.description = data.description;
                this.maxPoints = data.maxPoints;
                this.version = data.version;
            },
            setScore: function(score) {
                console.log("Model received score: ", score);
                switch (score) {
                    case this.max:
                        this.score = this.maxPoints;
                        break;
                    case this.min:
                        this.score = 0;
                        break;
                    default: // this.none
                        this.score = Scale.notGraded;
                        break;
                }
                console.log(this.score);
            }
        };

        // Post.get = function(postId) {
        //     var d = $q.defer();
        //     $http.get('/apps/campfire/api/post/get/' + postId).then(function (result) {
        //         var data = Post.transformer(result.data);
        //         d.resolve(data);
        //     });
        //     return d.promise;
        // };

        // static methods
        Scale.build = function (data) {
            if (data) {
                return new Scale(
                    data.id,
                    data.type,
                    data.label,
                    data.description,
                    data.maxPoints,
                    data.version
                );
            }
            return new Scale();
        };

        Scale.notGraded = "Not graded";

        Scale.transformer = function (data) {
            if (angular.isArray(data)) {
                return data.map(Scale.build);
            }
            return Scale.build(data);
        };

        return Scale;
    });
})();