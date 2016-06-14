<div ng-controller="adminCtrl as admin" class="container">
    <h2>Course Versions</h2>
    <p>Choose a course version in which to manage forums.</p>
    <div ng-show="admin.loading" class="progress">
        <div class="indeterminate"></div>
    </div>
    <form>
        <input type="text" ng-model="admin.filterPhrase" name="filterPhrase" />
    </form>
    <ul ng-show="admin.hasVersions" class="collapsible popout" data-collapsible="accordion">
        <li ng-repeat="version in admin.versions | filter:admin.filterPhrase">
            <div class="collapsible-header">
                {{version.courseCode}} {{version.courseName}} ({{version.name}}) <small>{{version.programName}}</small>
                <span class="badge">{{version.numForums}} forums</span>
            </div>
            <div class="collapsible-body">
                <button ng-click="admin.addPostToVersion(version)" class="btn-floating btn-small waves-effect waves-light red"><i class="material-icons">add</i></button>
                <ul class="collection">
                    <li ng-repeat="forum in version.forums track by forum.id" class="collection-item">
                        <a href="admin/forum/{{forum.id}}">{{forum.label}}</a>
                    </li>
                </ul>
                <p>No forums in this version yet.</p> 
            </div>
        </li>
    </ul>
</div>
