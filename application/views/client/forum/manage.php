<div ng-controller="forumAdminCtrl as forum" ng-init="init('{forum.id}')" class="container page-manage-forum">
    <div class="row section">
        <div class="col s9 m10 l11">
            <h1 id="forum-label">{forum.label} </h1>
            <p>(<span id="forum-numPosts">{forum.num_posts}</span> posts; <span id="forum-maxPoints">{forum.max_points}</span> points)</p>
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
    <p class="right">
        <i class="material-icons">link</i> {base_url}{section-slug}/forum/{forum.id}
    </p>
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
                    <div class="input-field col s8">
                        <input id="edit-forum-label" type="text" class="validate" ng-model="forum.forum.label">
                        <label ng-class="{'active' : forum.isLabelActive}" for="label"
                               data-error="You must provide a label for this forum" data-success="Looks good!">Label</label>
                    </div>
                    <div class="input-field col s4">
                        <input id="edit-forum-numPosts" type="number" class="validate" ng-model="forum.forum.numPosts">
                        <label ng-class="{'active' : forum.isNumPostsActive}" for="edit-forum-numPosts"
                               data-error="Enter the minimum number of posts expected in this forum"
                               data-success="Work it.">Num. Posts</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s8">
                        <textarea id="edit-forum-description" class="materialize-textarea" ng-model="forum.forum.description"></textarea>
                        <label ng-class="{'active' : forum.isDescriptionActive}" for="description">Description</label>
                    </div>
                    <div class="input-field col s4">
                        <input id="edit-forum-maxPoints" type="number" class="validate" ng-model="forum.forum.maxPoints">
                        <label ng-class="{'active' : forum.isMaxPointsActive}" for="edit-forum-maxPoints"
                               data-error="Enter the maximum number of points a student can earn for full participation in this forum"
                               data-success="That's nifty!">Max. Points</label>
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

    <div id="modal-delete-thread" class="modal">
        <div class="modal-content">
            <h4>Are you sure?</h4>
            <p>Are you sure you want to delete this thread? You cannot undo this action and the thread will be removed permanently.</p>
        </div>
        <div class="modal-footer">
            <a href="#" ng-click="forum.cancelDeleteThread($event)" class="modal-action modal-close waves-effect waves-green btn-flat">Oops! Nevermind.</a>
            <a href="#" ng-click="forum.deleteThread($event)" class="modal-action modal-close waves-effect waves-green btn-flat">Yes, delete it!</a>
        </div>
    </div>
</div>