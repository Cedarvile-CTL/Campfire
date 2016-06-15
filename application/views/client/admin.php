<div ng-controller="adminCtrl as admin" class="container">
    <h2>Course Versions</h2>
    <p>Choose a course version in which to manage forums.</p>
    <div ng-show="admin.loading" class="progress">
        <div class="indeterminate"></div>
    </div>
    <div class="row">
        <form class="col s12">
            <div class="input-field">
                <i class="material-icons prefix">search</i>
                <input type="text" ng-model="admin.filterPhrase" name="filterPhrase" placeholder="Search versions..." />
            </div>
        </form>
    </div>
    <ul ng-show="admin.hasVersions" class="collapsible popout" data-collapsible="accordion">
        <li ng-repeat="version in admin.versions | filter:admin.filterPhrase" id="version-{{version.id}}">
            <div class="collapsible-header">
                {{version.courseCode}} {{version.courseName}} ({{version.name}}) <small>{{version.programName}}</small>
                <span class="badge">{{version.numForums}} forums</span>
            </div>
            <div class="collapsible-body">
                <button data-target="modal-add-forum" ng-click="admin.addForum($event, version.id)"
                        class="btn-floating btn-small waves-effect waves-light light-green modal-trigger">
                    <i class="material-icons">add</i>
                </button>
                <ul ng-show="version.hasForums" class="collection">
                    <li ng-repeat="forum in version.forums track by forum.id" class="collection-item">
                        <a href="admin/forum/{{forum.id}}">{{forum.label}}</a>
                        <ul class="forum-options">
                            <button ng-click="admin.editForum($event, forum)"
                                    class="btn-floating btn waves-effect waves-light amber">
                                <i class="material-icons">edit</i>
                            </button>
                            <button ng-click="admin.cloneForum($event, version, forum)"
                                    class="btn-floating btn waves-effect waves-light">
                                <i class="material-icons">content_copy</i>
                            </button>
                            <button ng-click="admin.confirmDeleteForum($event, version.id, forum.id)"
                                    class="btn-floating btn waves-effect waves-light red">
                                <i class="material-icons">delete</i>
                            </button>
                        </ul>
                    </li>
                </ul>
                <p ng-hide="version.hasForums">No forums in this version yet.</p>
            </div>
        </li>
    </ul>
    <form ng-submit="admin.saveForum()">
        <div id="modal-edit-forum" class="modal bottom-sheet">
            <div class="modal-content">
                <h2>Edit a Forum</h2>
                <div class="row">
                    <div class="input-field col s12">
                        <input id="edit-forum-label" type="text" class="validate" ng-model="admin.activeForumLabel">
                        <label ng-class="{'active' : admin.isLabelActive}" for="label" data-error="You must provide a label for this forum" data-success="Looks good!">Label</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <textarea id="edit-forum-description" class="materialize-textarea" ng-model="admin.activeForumDescription"></textarea>
                        <label ng-class="{'active' : admin.isDescriptionActive}" for="description">Description</label>
                    </div>
                </div>
                <input type="hidden" id="edit-forum-version" name="versionId" ng-model="admin.activeVersion" />
                <input type="hidden" id="edit-forum-id" name="forumId" ng-model="admin.activeForum" />
            </div>
            <div class="modal-footer">
                <button type="submit" class="modal-action modal-close waves-effect waves-green btn-flat">Save</button>
            </div>
        </div>
    </form>
    <div id="modal-delete-forum" class="modal">
        <div class="modal-content">
            <h4>Are you sure?</h4>
            <p>Are you sure you want to delete this forum? You cannot undo this action and the forum will be removed permanently.</p>
        </div>
        <div class="modal-footer">
            <a href="#" ng-click="admin.cancelDeleteForum($event)" class="modal-action modal-close waves-effect waves-green btn-flat">Oops! Nevermind.</a>
            <a href="#" ng-click="admin.deleteForum($event)" class="modal-action modal-close waves-effect waves-green btn-flat">Yes, delete it!</a>
        </div>
    </div>
</div>
