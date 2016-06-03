(function () {
    'use strict';

    var app = angular.module('campfire-client', [
        'ngSanitize',
        'ngRoute'
    ]);

    app.config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'mainCtrl',
                controllerAs: 'main',
                templateUrl: './client/dev/main/view.html'
            })
            .when('/forum/:forumId/', {
                controller: 'forumCtrl',
                controllerAs: 'forum',
                templateUrl: './client/dev/forum/view.html'
            })
            .when('/thread/:threadId/', {
                controller: 'threadCtrl',
                controllerAs: 'thread',
                templateUrl: './client/dev/thread/view.html'
            })
            .when('/post/:postId/', {
                controller: 'postCtrl',
                controllerAs: 'post',
                templateUrl: './client/dev/post/view.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .value('$', window.$);

})();

function activateMaterialize(source) {
    $('.collapsible').collapsible();
    console.log("Loaded Materialize JS in " + source);
}