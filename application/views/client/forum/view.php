<div ng-controller="forumCtrl as forum" ng-init="init('{forum_id}')" class="{is_grader?}grader{/is_grader?} forum container">
    <h1>{{forum.forum.label}}</h1>
    {is_grader?}
    <a href="{base_url}main/forum_grades/{forum_id}" class="btn-view-grades right btn btn-waves">View grade data &raquo;</a>
    {/is_grader?}
    <ul class="collapsible popout" data-collapsible="expandable" ng-show="forum.hasThreads">
        <campfire-thread thread="thread" ng-repeat="thread in forum.forum.threads"></campfire-thread>
    </ul>
    <p ng-hide="forum.hasThreads">There are no threads available for this forum at this time.</p>
</div>