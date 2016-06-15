function activateMaterialize(source){$(".collapsible").collapsible()}function tinyMCEInit(selector){console.log("Activating TinyMCE on "+selector),tinymce.init({selector:selector,menubar:!1,plugins:"link",toolbar:["undo redo | bold italic | bullist numlist | outdent indent blockquote | underline superscript subscript | link | removeformat"],setup:function(editor){editor.on("change",function(){editor.save()})}})}!function(){"use strict";var app=angular.module("campfire-client",["ngSanitize","ngRoute"]);app.config(function($routeProvider){}).value("$",window.$)}(),function(){"use strict";angular.module("campfire-client").factory("Version",function($q,$http,Forum){var versions=[],Version=function(id,name,courseCode,courseName,programName,numForums,forums){this.id=id,this.name=name,this.courseCode=courseCode,this.courseName=courseName,this.programName=programName,this.numForums=numForums,this.forums=Forum.transformer(forums),this.hasForums=!!(this.forums&&this.forums.length>0)};return Version.prototype={cloneForum:function(forum){var version=this,clone=new Forum(null,forum.label,forum.description,forum.version);clone.save().then(function(result){version.forums.push(result),version.hasForums=!0})},deleteForum:function(forumId){var version=this,d=$q.defer(),forum=_.find(version.forums,{id:forumId});return forum?(console.log("Found forum: ",forum),$http.get("/apps/campfire/api/forum/delete/"+forum.id).then(function(result){_.remove(version.forums,forum),d.resolve(result)}),d.promise):(console.log("Couldn't find forum. ",forum),!1)},saveForum:function(data){var d=$q.defer(),version=this,isNew=!1,forum;return data.id>0?forum=_.find(version.forums,{id:data.id}):(data.version=version.id,forum=new Forum(null),isNew=!0),forum.save(data).then(function(result){isNew&&version.forums.push(result),version.hasForums=!0,d.resolve(result)}),d.promise}},Version.get=function(versionId){var d=$q.defer();return $http.get("/apps/campfire/api/version/get/"+versionId).then(function(result){var data=Version.transformer(result.data);d.resolve(data)}),d.promise},Version.getAll=function(){var d=$q.defer();return $http.get("/apps/campfire/api/version/all").then(function(result){var data=Version.transformer(result.data);d.resolve(data)}),d.promise},Version.build=function(data){return data?new Version(data.versionID?data.versionID:data.id,data.name,data.courseCode,data.courseName,data.programName,data.num_forums?data.num_forums:data.numForums,data.forums):new Version},Version.transformer=function(data){return angular.isArray(data)?data.map(Version.build):Version.build(data)},Version})}(),function(){"use strict";angular.module("campfire-client").factory("Main",function($q,$http,Forum){var Main=function(){};return Main.prototype={forums:[]},Main.forums=[],Main.getForumsForVersion=function(versionID){var d=$q.defer();return $http.get("/apps/campfire/api/forum/all_for_version/"+versionID).then(function(result){var data=Forum.transformer(result.data);d.resolve(data)}),d.promise},Main.getForumsForActiveSection=function(){var d=$q.defer();return $http.get("/apps/campfire/api/forum/all_for_section/").then(function(result){var data=[];result.data&&(data=Forum.transformer(result.data)),d.resolve(data)}),d.promise},Main})}(),function(){"use strict";angular.module("campfire-client").factory("User",function($q,$http){var User=function(id,username,firstName,lastName,email,name,accessLevel){this.id=Number(id),this.username=username,this.firstName=firstName,this.lastName=lastName,this.email=email,this.name=name,this.accessLevel=accessLevel};return User.prototype={},User.get=function(userId){var d=$q.defer();return $http.get("api/user/get/"+userId).then(function(result){var data=User.transformer(result.data);d.resolve(data)}),d.promise},User.getList=function(options){var d=$q.defer();return $http.get("api/user/get_list",options).then(function(result){var data=User.transformer(result.data);d.resolve(data)}),d.promise},User.build=function(data){return data?new User(data.id,data.username,data.firstName,data.lastName,data.email,data.name,data.accessLevel):new User},User.activeUser=new User(1337970,"philschanely","Phil","Schanely","philschanely@cedarville.edu","Phil Schanely",{id:1,name:"Super Admin",order:1}),User.transformer=function(data){return angular.isArray(data)?data.map(User.build):User.build(data)},User})}(),function(){"use strict";angular.module("campfire-client").factory("Forum",function($q,$http,Thread){var forums=[],Forum=function(id,label,description,version,threads){this.update({id:id,label:label,description:description,version:version}),this.threads=Thread.transformer(threads),this.loading=!1};return Forum.prototype={modelProps:["id","label","description","version"],save:function(form_data){var forum=this;angular.forEach(form_data,function(val,key){_.includes(forum.modelProps,key)&&(forum[key]=val)});var url="/apps/campfire/api/forum/save",data={label:this.label,description:this.description};null===this.id||0===this.id?(console.log("New forum"),data.version=this.version):(console.log("Edit forum"),url+="/"+this.id);var d=$q.defer();return forum.loading=!0,$http.post(url,data).then(function(result){forum.update(result.data),forum.loading=!1,d.resolve(forum)}),d.promise},update:function(data){this.id=data.id,this.id=data.id,this.label=data.label,this.description=data.description,this.version=data.version}},Forum.get=function(forumId){var d=$q.defer();return $http.get("/apps/campfire/api/forum/get/"+forumId).then(function(result){var data=Forum.transformer(result.data);d.resolve(data)}),d.promise},Forum.getList=function(options){var d=$q.defer();return $http.get("/apps/campfire/api/forum/get_list",options).then(function(result){var data=Forum.transformer(result.data);d.resolve(data)}),d.promise},Forum.build=function(data){return data?new Forum(data.id,data.label,data.description,data.version,data.threads):new Forum},Forum.transformer=function(data){return angular.isArray(data)?data.map(Forum.build):Forum.build(data)},Forum})}(),function(){"use strict";angular.module("campfire-client").factory("Thread",function($q,$http,Post){var threads=[],Thread=function(id,label,description,posts){this.id=id,this.label=label,this.description=description,this.posts=angular.isArray(posts)?Post.transformer(posts):[]};return Thread.prototype={getPosts:function(){var thread=this,d=$q.defer();return Thread.getPosts(thread.id).then(function(result){thread.posts=result,d.resolve(result)}),d.promise},addPost:function(){var d=$q.defer(),thread=this,newPost=Post["new"](null,null,thread.id);return newPost.save({body:""}).then(function(result){result.editing=!0,result.isNew=!0,thread.posts.unshift(result),d.resolve(result)}),d.promise}},Thread.get=function(threadId){var d=$q.defer();return $http.get("/apps/campfire/api/thread/get/"+threadId).then(function(result){var data=Forum.transformer(result.data);d.resolve(data)}),d.promise},Thread.getList=function(options){var d=$q.defer();return $http.get("/apps/campfire/api/thread/get_list",options).then(function(result){var data=Thread.transformer(result.data);d.resolve(data)}),d.promise},Thread.getPosts=function(threadId){var d=$q.defer();return $http.get("/apps/campfire/api/thread/get_posts/"+threadId).then(function(result){var data=[];null!==result.data&&(data=Post.transformer(result.data)),d.resolve(data)}),d.promise},Thread.build=function(data){return data?new Thread(data.id,data.label,data.description,data.posts):new Thread},Thread.transformer=function(data){return angular.isArray(data)?data.map(Thread.build):Thread.build(data)},Thread})}(),function(){"use strict";angular.module("campfire-client").factory("Post",function($q,$http,User){var Post=function(id,body,posts,user,date_posted,date_updated,parent,section,thread){this.update({id:id,body:body,user:user,date_posted:date_posted,date_updated:date_updated}),this.parent=parent,this.section=section,this.thread=thread,this.posts=angular.isArray(posts)?Post.transformer(posts):[],this.hasPosts=this.posts.length>0,this.isMine=this.user.id===User.activeUser.id,this.notMine=!this.isMine,this.editing=!1,this.isNew=!1};return Post.prototype={modelProps:["id","body","user","date_posted","date_updated","section","parent"],addReply:function(){var d=$q.defer(),post=this,newPost=Post["new"](post.id,post.section,post.thread);return newPost.save({body:""}).then(function(result){result.editing=!0,result.isNew=!0,post.posts.unshift(result),d.resolve(result)}),d.promise},"delete":function(){var d=$q.defer();return $http.get("/apps/campfire/api/post/delete/"+this.id).then(function(result){d.resolve(result)}),d.promise},save:function(form_data){var post=this;angular.forEach(form_data,function(val,key){_.includes(post.modelProps,key)&&(post[key]=val)});var url="/apps/campfire/api/post/save",data={body:this.body,date_updated:Date.parse(this.date_updated).toString("u").replace("Z","")};null===this.id||0===this.id?(data.date_posted=data.date_updated,data.user=this.user.id,data.section=this.section,data.parent=this.parent,data.thread=this.thread):url+="/"+this.id;var d=$q.defer();return post.loading=!0,$http.post(url,data).then(function(result){post.update(result.data),d.resolve(post),post.loading=!1}),d.promise},update:function(data){this.id=data.id,this.body=data.body,data.user instanceof User?this.user=data.user:this.user=User.transformer(data.user),this.date_posted=Date.parse(data.date_posted),this.date_updated=Date.parse(data.date_updated)}},Post["new"]=function(parent,section,thread){return new Post(null,"",[],User.activeUser,Date.today().setTimeToNow(),Date.today().setTimeToNow(),parent,section,thread)},Post.get=function(postId){var d=$q.defer();return $http.get("/apps/campfire/api/post/get/"+postId).then(function(result){var data=Post.transformer(result.data);d.resolve(data)}),d.promise},Post.getList=function(options){var d=$q.defer();return $http.get("/apps/campfire/api/post/get_list",options).then(function(result){var data=Post.transformer(result.data);d.resolve(data)}),d.promise},Post.build=function(data){return data?new Post(data.id,data.body,data.posts,data.user,data.date_posted,data.date_updated,data.parent,data.section,data.thread):new Post},Post.transformer=function(data){return angular.isArray(data)?data.map(Post.build):Post.build(data)},Post})}(),function(){"use strict";angular.module("campfire-client").controller("mainCtrl",function($scope,Main,Forum){var vm=this;vm.courseVersion={id:1},vm.label="Forums",vm.forums=[],vm.hasForums=!1;var initialize=function(){Main.getForumsForActiveSection().then(function(result){vm.forums=result,vm.forums.length>0&&(vm.hasForums=!0)})};initialize()})}(),function(){"use strict";angular.module("campfire-client").controller("forumCtrl",function($routeParams,$scope,Forum){var vm=this;vm.forumId=null,vm.forum={},vm.hasThreads=!1,$scope.init=function(forumId){vm.forumId=forumId,vm.initialize()},vm.initialize=function(){Forum.get(vm.forumId).then(function(result){vm.forum=result,vm.hasThreads=vm.forum.threads.length>1}),activateMaterialize("Forum controller")},vm.getPosts=function(e){}})}(),function(){"use strict";angular.module("campfire-client").filter("filterByPhrase",function(){return function(items,phrase){var filtered=[];return angular.forEach(items,function(item){phrase.length>0?console.log("Changed"):filtered.push(item)}),filtered}}).controller("adminCtrl",function($routeParams,$scope,Version){var vm=this;vm.versions=[],vm.hasVersions=!1,vm.loading=!1,vm.filterPhrase="",vm.activeVersion=0,vm.activeForum=0,vm.activeForumLabel="",vm.activeForumDescription="",vm.isLabelActive=!1,vm.isDescriptionActive=!1,vm.addForum=function(e,version){vm.setupEditForumModal(version),$("#modal-edit-forum").openModal()},vm.cancelDeleteForum=function(e){e.preventDefault(),vm.activeForum=0,vm.activeVersion=0},vm.confirmDeleteForum=function(e,versionId,forumId){vm.activeForum=forumId,vm.activeVersion=versionId,$("#modal-delete-forum").openModal()},vm.cloneForum=function(e,version,forum){version.cloneForum(forum)},vm.deleteForum=function(e){if(e.preventDefault(),console.log("Deleting forum "+vm.activeForum),vm.activeForum>0){var version=_.find(vm.versions,{id:vm.activeVersion});version?(version.deleteForum(vm.activeForum),vm.activeForum=0,vm.activeVersion=0):console.log("No matching version found.")}else console.log("No active forum. ",vm.activeForum)},vm.editForum=function(e,forum){vm.setupEditForumModal(forum.version,forum.id,forum.label,forum.description),$("#modal-edit-forum").openModal()},vm.saveForum=function(){var version=_.find(vm.versions,{id:vm.activeVersion});version.saveForum({label:vm.activeForumLabel,description:vm.activeForumDescription,id:vm.activeForum,version:vm.activeForum}),vm.activeVersion=0,vm.setupEditForumModal()},vm.initialize=function(){vm.loading=!0,Version.getAll().then(function(result){vm.versions=result,vm.hasVersions=vm.versions.length>0,vm.loading=!1,activateMaterialize("Admin controller after versions loaded")}),activateMaterialize("Admin controller")},vm.setupEditForumModal=function(versionId,forumId,label,description){vm.activeVersion=void 0===versionId?0:versionId,vm.activeForum=void 0===forumId?0:forumId,vm.activeForumLabel=void 0===label?"":label,vm.activeForumDescription=void 0===description?"":description,vm.isLabelActive=vm.activeForumLabel.length>0,vm.isDescriptionActive=vm.activeForumLabel.length>0},vm.initialize()})}(),function(){"use strict";function ThreadCtrl($scope,Thread){var vm=this;vm.posts=[],vm.hasPosts=!1,vm.loading=!1,vm.addPost=function(e){console.log("Clicked to add a post");var threadElement=$(e.target).closest(".thread");threadElement.hasClass("active")&&e.stopPropagation(e),vm.loading=!0,vm.thread.addPost(vm.sectionId).then(function(result){vm.hasPosts=!0,vm.loading=!1})},vm.childDeleted=function(e,data){if(_.includes(vm.posts,data.post)){e.stopPropagation(),_.pull(vm.posts,data.post);var msg="Post deleted successfully.";data.isNew&&(msg="Post cancelled."),Materialize.toast(msg,3e3)}},vm.getPosts=function(){vm.thread.getPosts().then(function(result){vm.posts=result,vm.hasPosts=vm.posts.length>0})},vm.initialize=function(){activateMaterialize("Thread directive"),vm.id=vm.thread.id,vm.label=vm.thread.label,vm.description=vm.thread.description,vm.posts=vm.thread.posts,$scope.$on("post:delete",vm.childDeleted)},vm.initialize()}angular.module("campfire-client").directive("campfireThread",function(Thread){return{replace:!0,scope:{},bindToController:{thread:"="},restrict:"E",templateUrl:"/apps/campfire/client/dev/thread/view.html",controller:["$scope","Thread",ThreadCtrl],controllerAs:"thread"}})}(),function(){"use strict";function PostCtrl($scope,$interval,Post,User){var vm=this;vm.edit=function(id,e){vm.loading=!0,vm.editing=!0,vm.interval=$interval(vm.checkForEditableArea,250)},vm.cancel=function(e){e.preventDefault(),console.log("Canceling save"),vm.editing=vm.post.editing=!1,vm.post.isNew&&(console.log("New item... delete it."),vm["delete"](e))},vm.cancelDelete=function(e){e.preventDefault()},vm.checkForEditableArea=function(){var postId="#post-"+vm.post.id,elem=$(postId+"-body");elem.length>0&&($interval.cancel(vm.interval),tinyMCEInit("#"+elem.attr("id")),vm.loading=!1)},vm["delete"]=function(id,e){e&&e.preventDefault();var isNew=vm.post.isNew;vm.post["delete"]().then(function(){$scope.$emit("post:delete",{post:vm.post,isNew:isNew})})},vm.reply=function(id,e){vm.loading=!0,vm.post.addReply().then(function(result){vm.hasPosts=vm.post.hasPosts=!0,vm.loading=!1})},vm.save=function(e){e.preventDefault(),vm.loading=!0;var postId="#post-"+vm.post.id,data={body:$(postId+"-body").val(),date_updated:Date.today().setTimeToNow()};vm.post.save(data).then(function(result){angular.forEach(vm.post,function(val,key){vm[key]=val}),vm.loading=!1,vm.editing=vm.post.editing=!1,Materialize.toast("Post saved successfully.",3e3)})},vm.toggleVisibility=function(id,e){},vm.initialize=function(){angular.forEach(vm.post,function(val,key){vm[key]=val}),vm.loading=!1,activateMaterialize("Post directive: "+vm.id),vm.editing&&vm.edit(),$(".modal-trigger").leanModal(),$scope.$on("post:delete",vm.childDeleted)},vm.childDeleted=function(e,data){if(_.includes(vm.post.posts,data.post)){e.stopPropagation(),_.pull(vm.post.posts,data.post);var msg="Post deleted successfully.";data.isNew&&(msg="Post cancelled."),Materialize.toast(msg,3e3)}},vm.initialize()}angular.module("campfire-client").directive("campfirePost",function(){return{replace:!0,scope:{},bindToController:{post:"="},restrict:"E",templateUrl:"/apps/campfire/client/dev/post/view.html",controller:["$scope","$interval","Post","User",PostCtrl],controllerAs:"post"}})}();
//# sourceMappingURL=./app.js.map