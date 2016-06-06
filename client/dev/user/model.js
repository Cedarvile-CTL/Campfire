(function () {
    'use strict';

    angular.module('campfire-client').factory('User', function ($q, $http) {

        var User = function (id, username, firstName, lastName, email, name, accessLevel) {
            this.id = Number(id);
            this.username = username;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.name = name;
            this.accessLevel = accessLevel;
        };

        User.activeUser = new User(
            1337970,
            "philschanely",
            "Phil",
            "Schanely",
            "philschanely@cedarville.edu",
            "Phil Schanely",
            {
                id: 1,
                name: "Super Admin",
                order: 1
            }
        );

        User.prototype = {
            
        };

        User.get = function(userId) {
            var d = $q.defer();
            $http.get('api/user/get/' + userId).then(function (result) {
                var data = User.transformer(result.data);
                d.resolve(data);
            });
            return d.promise;
        };

        User.getList = function(options) {
            var d = $q.defer();
            $http.get('api/user/get_list', options).then(function (result) {
                var data = User.transformer(result.data);
                d.resolve(data);
            });
            return d.promise;
        };


        // static methods
        User.build = function (data) {
            if (data) {
                return new User(
                    data.id,
                    data.username,
                    data.firstName,
                    data.lastName,
                    data.email,
                    data.name,
                    data.accessLevel
                );
            }
            return new User();
        };

        User.transformer = function (data) {
            if (angular.isArray(data)) {
                return data.map(User.build);
            }
            return User.build(data);
        };

        return User;
    });
})();