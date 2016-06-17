<div ng-controller="forumCtrl as forum" ng-init="init('{forum_id}')" class="container">
    <h1>{{forum.forum.label}}</h1>
    <ul class="collapsible popout" data-collapsible="expandable" ng-show="forum.hasThreads">
        <campfire-thread thread="thread" ng-repeat="thread in forum.forum.threads"></campfire-thread>
    </ul>
    <p ng-hide="forum.hasThreads">There are no threads available for this forum at this time.</p>
</div>