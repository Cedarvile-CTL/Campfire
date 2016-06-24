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
                this.id = data.id ? Number(data.id) : 0;
                this.type = data.type ? data.type : { id: 1 };
                this.label = data.label;
                this.description = data.description;
                this.maxPoints = Number(data.maxPoints);
                this.version = Number(data.version);
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
            },
            save: function (formData) {
                var scale = this;
                var url = '/apps/campfire/api/scale/save';

                var data = {
                    label: formData.label,
                    max_points: formData.maxPoints,
                    scale_type: formData.type,
                    version: scale.version
                };

                if (formData.id === null || formData.id === 0) {
                    console.log("New Scale");
                } else {
                    console.log("Edit scale");
                    url += "/" + formData.id;
                }

                console.log(url, data);

                var d = $q.defer();
                $http.post(url, data).then(function (result) {
                    console.log(result.data);
                    scale.update(result.data);
                    d.resolve(scale);
                });
                return d.promise;
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

        Scale.getVersionScales = function(versionId) {
            var d = $q.defer();
            $http.get('/apps/campfire/api/scale/all_for_version/' + versionId)
                .then(function (result) {
                    var data = Scale.transformer(result.data);
                    d.resolve(data);
                });
            return d.promise;
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