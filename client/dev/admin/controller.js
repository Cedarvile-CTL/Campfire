(function () {
    'use strict';

angular.module('campfire-client')
    .filter('filterByPhrase', function() {
        return function(items, phrase) {
            var filtered = [];
            angular.forEach(items, function(item) {
                if(phrase.length>0) {
                    console.log("Changed");
                } else {
                    filtered.push(item);
                }
            });
            return filtered;
        };
    })
    .controller('adminCtrl', function (
        $routeParams, $scope,
        Version
    ) {
        var vm = this;
        vm.versions = [];
        vm.hasVersions = false;
        vm.loading = false;
        vm.filterPhrase = '';
        vm.activeVersion = 0;
        vm.activeForum = 0;
        vm.activeForumLabel = '';
        vm.activeForumDescription = '';
        vm.isLabelActive = false;
        vm.isDescriptionActive = false;

        vm.addForum = function(e, version) {
            vm.setupEditForumModal(version);
            $("#modal-edit-forum").openModal();
        };

        vm.cancelDeleteForum = function(e) {
            e.preventDefault();
            vm.activeForum = 0;
            vm.activeVersion = 0;
        };

        vm.confirmDeleteForum = function(e, versionId, forumId) {
            vm.activeForum = forumId;
            vm.activeVersion = versionId;
            $("#modal-delete-forum").openModal();
        };

        vm.cloneForum = function(e, version, forum) {
            version.cloneForum(forum);
        };

        vm.deleteForum = function(e) {
            e.preventDefault();
            if (vm.activeForum > 0) {
                var version = _.find(vm.versions, { id: vm.activeVersion });
                if (version) {
                    version.deleteForum(vm.activeForum);
                    vm.activeForum = 0;
                    vm.activeVersion = 0;
                } else {
                    // console.log("No matching version found.");
                }
            } else {
                // console.log("No active forum. ", vm.activeForum);
            }
        };

        vm.editForum = function(e, forum) {
            vm.setupEditForumModal(forum.version, forum.id, forum.label, forum.description);
            $("#modal-edit-forum").openModal();
        };

        vm.saveForum = function() {
            var version = _.find(vm.versions, { id: vm.activeVersion });
            version.saveForum({
                label: vm.activeForumLabel,
                description: vm.activeForumDescription,
                id: vm.activeForum,
                version: vm.activeForum
            });
            vm.activeVersion = 0;
            vm.setupEditForumModal();
        };

        vm.initialize = function () {
            vm.loading = true;
            Version.getAll().then(function(result){
                vm.versions = result;
                vm.hasVersions = vm.versions.length > 0 ? true : false;
                vm.loading = false;
                activateMaterialize("Admin controller after versions loaded");
            });
            activateMaterialize("Admin controller");
        };

        vm.setupEditForumModal = function(versionId, forumId, label, description) {
            vm.activeVersion = (versionId === undefined) ? 0 : versionId;
            vm.activeForum = (forumId === undefined) ? 0 : forumId;
            vm.activeForumLabel = (label === undefined) ? '' : label;
            vm.activeForumDescription = (description === undefined) ? '' : description;
            vm.isLabelActive = vm.activeForumLabel.length>0 ? true : false;
            vm.isDescriptionActive = vm.activeForumLabel.length>0 ? true : false;
        };

        vm.initialize();
    });
})();