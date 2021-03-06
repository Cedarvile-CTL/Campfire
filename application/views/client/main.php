<div ng-controller="mainCtrl as main" class="container">
    <h1>{{main.label}}</h1>
    <ul ng-show="main.hasForums" class="row">
        <li class="forum card hoverable" ng-repeat="forum in main.forums">
            <div class="card-content">
                <h2 class="card-title label"><a ng-href="/apps/campfire/main/forum/{{forum.id}}">{{forum.label}}</a></h2>
                <div ng-bind-html="forum.description" class="description"></div>
            </div>
            <div class="card-action">
                <a href="/apps/campfire/main/forum/{{forum.id}}">Go to forum &raquo;</a>
            </div>
        </li>
    </ul>
    <p ng-hide="main.hasForums">No forums are available for this course at this time. Contact your professor for assistance.</p>
</div>