<div ng-controller="forumAdminCtrl as forum" ng-init="init('{forum.id}')" class="container page-manage-forum">
    <div class="row section">
        <div class="col s9 m10 l11">
            <h1 id="forum-label">{forum.label}</h1>
            <p  id="forum-description" class="flow-text">{forum.description}</p>
        </div>
        <div class="col s3 m2 l1 right-align">
            <button class="btn-edit-forum btn-floating btn-large waves-effect waves-light amber"
                    ng-click="forum.editForum($event)">
                <i class="material-icons">edit</i>
            </button>
        </div>
    </div>
    <button class="btn-add-forum btn-floating btn waves-effect waves-light light-green"
            ng-click="forum.addThread($event)">
        <i class="material-icons">add</i>
    </button>
    <div ng-show="forum.loading" class="progress">
        <div class="indeterminate"></div>
    </div>
    <ul class="collapsible popout" data-collapsible="expandable" ng-show="forum.hasThreads">
        <campfire-thread thread="thread" ng-repeat="thread in forum.forum.threads"></campfire-thread>
    </ul>
    <p ng-hide="forum.hasThreads">There are no threads available for this forum at this time.</p>

    <form ng-submit="forum.saveForum($event)">
        <div id="modal-edit-forum" class="modal bottom-sheet">
            <div class="modal-content">
                <h2>Edit Forum</h2>
                <div class="row">
                    <div class="input-field col s12">
                        <input id="edit-forum-label" type="text" class="validate" ng-model="forum.forum.label">
                        <label ng-class="{'active' : forum.isLabelActive}" for="label"
                               data-error="You must provide a label for this forum" data-success="Looks good!">Label</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <textarea id="edit-forum-description" class="materialize-textarea" ng-model="forum.forum.description"></textarea>
                        <label ng-class="{'active' : forum.isDescriptionActive}" for="description">Description</label>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="submit" class="modal-action modal-close waves-effect waves-green btn-flat">Save</button>
                <button type="button" class="modal-action modal-close waves-effect waves-amber btn-flat">Cancel</button>
            </div>
        </div>
    </form>

    <form ng-submit="forum.saveThread($event)">
        <div id="modal-edit-thread" class="modal bottom-sheet">
            <div class="modal-content">
                <h2>Edit Thread</h2>
                <div class="row">
                    <div class="input-field col s12">
                        <input id="edit-thread-label" type="text" class="validate" ng-model="forum.activeThreadLabel">
                        <label ng-class="{'active' : forum.isThreadLabelActive}" for="label"
                               data-error="You must provide a label for this thread" data-success="Looks good!">Label</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <textarea id="edit-thread-description" class="materialize-textarea" ng-model="forum.activeThreadDescription"></textarea>
                        <label ng-class="{'active' : forum.isThreadDescriptionActive}" for="description">Description</label>
                    </div>
                </div>
                <input type="hidden" id="edit-thread-forum" name="forum" ng-model="forum.activeThreadForum" />
                <input type="hidden" id="edit-thread-id" name="id" ng-model="forum.activeThreadId" />
            </div>
            <div class="modal-footer">
                <button type="submit" class="modal-action modal-close waves-effect waves-green btn-flat">Save</button>
                <button type="button" class="modal-action modal-close waves-effect waves-amber btn-flat">Cancel</button>
            </div>
        </div>
    </form>
</div>