function activateMaterialize(source){$(".collapsible").collapsible()}function tinyMCEInit(selector){console.log("Activating TinyMCE on "+selector),tinymce.init({selector:selector,menubar:!1,plugins:"link",toolbar:["undo redo | bold italic | bullist numlist | outdent indent blockquote | underline superscript subscript | link | removeformat"],setup:function(editor){editor.on("change",function(){editor.save()})}})}!function(){"use strict";var app=angular.module("campfire-client",["ngSanitize","ngRoute"]);app.config(function($routeProvider){}).value("$",window.$)}(),function(){"use strict";angular.module("campfire-client").filter("filterByPhrase",function(){return function(items,phrase){var filtered=[];return angular.forEach(items,function(item){phrase.length>0?console.log("Changed"):filtered.push(item)}),filtered}}).controller("adminCtrl",function($routeParams,$scope,Version){var vm=this;vm.versions=[],vm.hasVersions=!1,vm.loading=!1,vm.filterPhrase="",vm.activeVersion=0,vm.activeForum=0,vm.activeForumLabel="",vm.activeForumDescription="",vm.activeForumNumPosts=0,vm.activeForumMaxPoints=0,vm.isLabelActive=!1,vm.isDescriptionActive=!1,vm.addForum=function(e,version){vm.setupEditForumModal(version),$("#modal-edit-forum").openModal()},vm.cancelDeleteForum=function(e){e.preventDefault(),vm.activeForum=0,vm.activeVersion=0},vm.confirmDeleteForum=function(e,versionId,forumId){vm.activeForum=forumId,vm.activeVersion=versionId,$("#modal-delete-forum").openModal()},vm.cloneForum=function(e,version,forum){version.cloneForum(forum)},vm.deleteForum=function(e){if(e.preventDefault(),vm.activeForum>0){var version=_.find(vm.versions,{id:vm.activeVersion});version&&(version.deleteForum(vm.activeForum),vm.activeForum=0,vm.activeVersion=0)}},vm.editForum=function(e,forum){vm.setupEditForumModal(forum.version,forum.id,forum.label,forum.description,forum.maxPoints,forum.numPosts),$("#modal-edit-forum").openModal()},vm.saveForum=function(){var version=_.find(vm.versions,{id:vm.activeVersion});version.saveForum({label:vm.activeForumLabel,description:vm.activeForumDescription,id:vm.activeForum,version:vm.activeForum,numPosts:Number(vm.activeForumNumPosts),maxPoints:Number(vm.activeForumMaxPoints)}),vm.setupEditForumModal()},vm.initialize=function(){vm.loading=!0,Version.getAll().then(function(result){vm.versions=result,vm.hasVersions=vm.versions.length>0,vm.loading=!1,activateMaterialize("Admin controller after versions loaded")}),activateMaterialize("Admin controller")},vm.setupEditForumModal=function(versionId,forumId,label,description,maxPoints,numPosts){vm.activeVersion=void 0===versionId?0:versionId,vm.activeForum=void 0===forumId?0:forumId,vm.activeForumLabel=void 0===label?"":label,vm.activeForumMaxPoints=void 0===maxPoints?"":maxPoints,vm.activeForumNumPosts=void 0===numPosts?"":numPosts,vm.activeForumDescription=void 0===description?"":description,vm.isLabelActive=vm.activeForumLabel.length>0,vm.isDescriptionActive=vm.activeForumLabel.length>0,vm.isMaxPointsActive=vm.activeForumMaxPoints>=0,vm.isNumPostsActive=vm.activeForumNumPosts>=0},vm.initialize()})}(),function(){"use strict";angular.module("campfire-client").controller("forumAdminCtrl",function($routeParams,$scope,Forum,Thread){var vm=this;vm.loading=!1,vm.forumId=null,vm.forum={},vm.hasThreads=!1,vm.isLabelActive=!1,vm.isDescriptionActive=!1,vm.isNumPostsActive=!1,vm.isMaxPointsActive=!1,vm.adminEditing=!0,vm.isThreadLabelActive=!1,vm.isThreadDescriptionActive=!1,vm.activeThreadId=0,vm.activeThreadLabel="",vm.activeThreadDescription="",vm.activeThreadForum=0,$scope.init=function(forumId){vm.forumId=forumId,vm.initialize()},vm.initialize=function(){vm.loading=!0,Forum.get(vm.forumId,vm.adminEditing).then(function(result){vm.forum=result,vm.hasThreads=vm.forum.threads.length>0,vm.loading=!1,vm.hasThreads&&angular.forEach(vm.forum.threads,function(thread,key){thread.adminEditing=vm.adminEditing}),activateMaterialize("Forum controller")}),$scope.$on("thread:edit",vm.editThread),$scope.$on("thread:clone",vm.cloneThread),$scope.$on("thread:delete",vm.confirmDeleteThread)},vm.editForum=function(){vm.isLabelActive=vm.forum.label.length>0,vm.isDescriptionActive=vm.forum.description.length>0,vm.isNumPostsActive=vm.forum.numPosts>=0,vm.isMaxPointsActive=vm.forum.maxPoints>=0,$("#modal-edit-forum").openModal()},vm.editThread=function(e,data){vm.setupEditThreadModal(data.thread.forum,data.thread.id,data.thread.label,data.thread.description),$("#modal-edit-thread").openModal()},vm.cloneThread=function(e,data){vm.forum.cloneThread(data.thread),vm.hasThreads=!0},vm.confirmDeleteThread=function(e,data){vm.activeThreadId=data.thread.id,$("#modal-delete-thread").openModal()},vm.deleteThread=function(e){vm.forum.deleteThread(vm.activeThreadId),vm.activeThreadId=0},vm.addThread=function(e){vm.setupEditThreadModal(vm.forumId),$("#modal-edit-thread").openModal()},vm.saveForum=function(e){e.preventDefault(),vm.forum.save().then(function(){$("#forum-label").text(vm.forum.label),$("#forum-description").text(vm.forum.description),$("#forum-numPosts").text(vm.forum.numPosts),$("#forum-maxPoints").text(vm.forum.maxPoints)})},vm.saveThread=function(e){e.preventDefault();var thread;vm.activeThreadId>0?(thread=_.find(vm.forum.threads,{id:vm.activeThreadId}),thread.adminEditing=vm.adminEditing):(thread=new Thread(null),thread.adminEditing=vm.adminEditing),thread.save({label:vm.activeThreadLabel,description:vm.activeThreadDescription,forum:vm.activeThreadForum}).then(function(result){vm.forum.updateThreads(result),vm.hasThreads=!0,$scope.$broadcast("thread:updated",result)})},vm.getPosts=function(e){},vm.setupEditThreadModal=function(forumId,threadId,label,description){vm.activeThreadForum=void 0===forumId?0:forumId,vm.activeThreadId=void 0===threadId?0:threadId,vm.activeThreadLabel=void 0===label?"":label,vm.activeThreadDescription=void 0===description?"":description,vm.isThreadLabelActive=vm.activeThreadLabel.length>0,vm.isThreadDescriptionActive=vm.activeThreadDescription.length>0}})}(),function(){"use strict";angular.module("campfire-client").controller("forumCtrl",function($routeParams,$scope,Forum){var vm=this;vm.forumId=null,vm.forum={},vm.hasThreads=!1,$scope.init=function(forumId){vm.forumId=forumId,vm.initialize()},vm.initialize=function(){Forum.get(vm.forumId).then(function(result){vm.forum=result,vm.hasThreads=vm.forum.threads.length>0}),activateMaterialize("Forum controller")},vm.getPosts=function(e){}})}(),function(){"use strict";angular.module("campfire-client").controller("mainCtrl",function($scope,Main,Forum){var vm=this;vm.courseVersion={id:1},vm.label="Forums",vm.forums=[],vm.hasForums=!1;var initialize=function(){Main.getForumsForActiveSection().then(function(result){vm.forums=result,vm.forums.length>0&&(vm.hasForums=!0)})};initialize()})}(),function(){"use strict";angular.module("campfire-client").factory("Forum",function($q,$http,Thread){var forums=[],Forum=function(id,label,description,version,threads,maxPoints,numPosts){this.update({id:id,label:label,description:description,version:version,maxPoints:maxPoints,numPosts:numPosts}),this.threads=threads?Thread.transformer(threads):[],this.loading=!1};return Forum.prototype={modelProps:["id","label","description","version","numPosts","maxPoints"],cloneThread:function(thread){var forum=this;console.log("Cloning with scale: ",thread.scale);var clone=new Thread(null,thread.label,thread.description,thread.forum,[],thread.scale);clone.save().then(function(result){result.adminEditing=!0,forum.threads.push(result)})},deleteThread:function(threadId){var forum=this,thread=_.find(this.threads,{id:threadId});Thread["delete"](threadId).then(function(result){_.pull(forum.threads,thread)})},updateThreads:function(thread){var matchingThread=_.find(this.threads,thread);matchingThread?matchingThread.update(thread):this.threads.push(thread),this.threads=_.sortBy(this.threads,"label")},getThreads:function(){var d=$q.defer(),forum=this;return forum.loading=!0,Thread.getList({forum:forum.id}).then(function(result){forum.threads=Thread.transformer(result.data)}),d.promise},save:function(form_data){var forum=this;angular.forEach(form_data,function(val,key){_.includes(forum.modelProps,key)&&(forum[key]=val)});var url="/apps/campfire/api/forum/save",data={label:this.label,description:this.description,num_posts:this.numPosts,max_points:this.maxPoints};null===this.id||0===this.id?(console.log("New forum"),data.version=this.version):(console.log("Edit forum"),url+="/"+this.id);var d=$q.defer();return forum.loading=!0,$http.post(url,data).then(function(result){forum.update(result.data),forum.loading=!1,d.resolve(forum)}),d.promise},update:function(data){this.id=data.id,this.label=data.label,this.description=data.description,this.version=data.version,this.maxPoints=Number(data.maxPoints),this.numPosts=Number(data.numPosts),void 0!==data.num_posts&&(this.numPosts=Number(data.num_posts)),void 0!==data.max_points&&(this.maxPoints=Number(data.max_points)),console.log()}},Forum.get=function(forumId,isAdmin){isAdmin="undefined"!=typeof isAdmin?isAdmin:!1;var isAdminParam=isAdmin?"1":"0",d=$q.defer(),url="/apps/campfire/api/forum/get/"+forumId+"/"+isAdminParam;return $http.get(url).then(function(result){var data=Forum.transformer(result.data);d.resolve(data)}),d.promise},Forum.getList=function(options){var d=$q.defer();return $http.get("/apps/campfire/api/forum/get_list",options).then(function(result){var data=Forum.transformer(result.data);d.resolve(data)}),d.promise},Forum.build=function(data){return data?(void 0!==data.num_posts&&(data.numPosts=Number(data.num_posts)),void 0!==data.max_points&&(data.maxPoints=Number(data.max_points)),new Forum(data.id,data.label,data.description,data.version,data.threads,data.maxPoints,data.numPosts)):new Forum},Forum.transformer=function(data){return angular.isArray(data)?data.map(Forum.build):Forum.build(data)},Forum})}(),function(){"use strict";angular.module("campfire-client").factory("Main",function($q,$http,Forum){var Main=function(){};return Main.prototype={forums:[]},Main.forums=[],Main.getForumsForVersion=function(versionID){var d=$q.defer();return $http.get("/apps/campfire/api/forum/all_for_version/"+versionID).then(function(result){var data=Forum.transformer(result.data);d.resolve(data)}),d.promise},Main.getForumsForActiveSection=function(){var d=$q.defer();return $http.get("/apps/campfire/api/forum/all_for_section/").then(function(result){var data=[];result.data&&(data=Forum.transformer(result.data)),d.resolve(data)}),d.promise},Main})}(),function(){"use strict";angular.module("campfire-client").factory("Scale",function($q,$http,User){var Scale=function(id,type,label,description,maxPoints,version,authorViewing,graderViewing){this.update({id:id,type:type,label:label,description:description,maxPoints:maxPoints,version:version}),this.authorViewing=authorViewing,this.graderViewing=graderViewing,this.score=Scale.notGraded,this.maxPoints=this.maxPoints?Number(this.maxPoints):1,this.max="MAX",this.min="MIN",this.none="NONE"};return Scale.prototype={update:function(data){this.id=data.id?Number(data.id):0,this.type=data.type?data.type:{id:1},this.label=data.label,this.description=data.description,this.maxPoints=Number(data.maxPoints),this.version=Number(data.version)},setScore:function(score){switch(score){case this.max:this.score=this.maxPoints;break;case this.min:this.score=0;break;default:void 0===score||null===score||""===score?this.score=Scale.notGraded:this.score=score}},save:function(formData){var scale=this,url="/apps/campfire/api/scale/save",data={label:formData.label,max_points:formData.maxPoints,scale_type:formData.type,version:scale.version};null===formData.id||0===formData.id?console.log("New Scale"):(console.log("Edit scale"),url+="/"+formData.id);var d=$q.defer();return $http.post(url,data).then(function(result){console.log(result.data),scale.update(result.data),d.resolve(scale)}),d.promise}},Scale.notGraded="Not graded",Scale.creditScale=1,Scale.numericScale=2,Scale.customScale=3,Scale.build=function(data){return data?new Scale(data.id,data.type,data.label,data.description,data.maxPoints,data.version,data.authorViewing,data.graderViewing):new Scale},Scale.getVersionScales=function(versionId){var d=$q.defer();return $http.get("/apps/campfire/api/scale/all_for_version/"+versionId).then(function(result){var data=Scale.transformer(result.data);d.resolve(data)}),d.promise},Scale.transformer=function(data){return angular.isArray(data)?data.map(Scale.build):Scale.build(data)},Scale})}(),function(){"use strict";function ScaleCreditCtrl($scope,$interval,User){var vm=this;vm.initialize=function(){vm.scale=vm.post.scale,$interval(function(){$(".dropdown-button").dropdown({constrain_width:!1,hover:!0,alignment:"right",belowOrigin:!0})},500,1)},vm.setScore=function(score,e){vm.post.scale.setScore(score),$scope.$emit("scale:setScore",vm.post.scale.score)},vm.initialize()}angular.module("campfire-client").directive("campfireScaleCredit",function(){return{replace:!0,scope:{},bindToController:{post:"="},restrict:"E",templateUrl:"/apps/campfire/client/dev/scale/credit/view.html",controller:["$scope","$interval","User",ScaleCreditCtrl],controllerAs:"vm"}})}(),function(){"use strict";function ThreadCtrl($scope,$timeout,Thread,Scale,User){var vm=this;vm.posts=[],vm.hasPosts=!1,vm.loading=!1,vm.versionScales=[],vm.scaleTypeCredit=1,vm.scaleTypeNumeric=2,vm.scaleId=null,vm.scaleLabel="",vm.scaleMaxPoints="",vm.scaleType="",vm.isScaleMaxPointsActive=vm.scaleLabel.length>0,vm.isScaleLabelActive=vm.scaleMaxPoints.length>0,vm.addPost=function(e){var threadElement=$(e.target).closest(".thread");threadElement.hasClass("active")&&e.stopPropagation(e),vm.loading=!0,vm.thread.addPost(vm.sectionId).then(function(result){vm.hasPosts=!0,vm.loading=!1})},vm.addScale=function(){vm.editScale(!0)},vm.cancelScaleEdit=function(){vm.setupEditScaleModal()},vm.childDeleted=function(e,data){if(_.includes(vm.posts,data.post)){e.stopPropagation(),_.pull(vm.posts,data.post);var msg="Post deleted successfully.";data.isNew&&(msg="Post cancelled."),Materialize.toast(msg,3e3)}vm.hasPosts=vm.posts.length>0},vm.edit=function(e){return vm.adminEditing?void $scope.$emit("thread:edit",{thread:vm.thread}):!1},vm.editScale=function(newScale){newScale=void 0===newScale?!1:newScale,console.log(newScale,vm.thread.scale),!newScale&&vm.thread.scale||(vm.thread.scale=new Scale,vm.thread.scale.version=vm.thread.version),vm.setupEditScaleModal(vm.thread.scale.id,vm.thread.scale.label,vm.thread.scale.maxPoints,vm.thread.scale.type.id),$("#modal-edit-scale-"+vm.thread.id).openModal()},vm["delete"]=function(e){return vm.adminEditing?void $scope.$emit("thread:delete",{thread:vm.thread}):!1},vm.clone=function(e){return vm.adminEditing?void $scope.$emit("thread:clone",{thread:vm.thread}):!1},vm.getPosts=function(){return vm.adminEditing?!1:void vm.thread.getPosts().then(function(result){vm.posts=vm.thread.posts,vm.hasPosts=vm.posts.length>0})},vm.getVersionScales=function(e){e.preventDefault(),Scale.getVersionScales(vm.thread.version).then(function(result){vm.versionScales=result,console.log(vm.versionScales)})},vm.initialize=function(){User.loadActiveUser(),activateMaterialize("Thread directive"),vm.setThreadValues(vm.thread),$scope.$on("post:delete",vm.childDeleted),$scope.$on("thread:updated",vm.updateThread),$scope.$on("post:cancelnew",vm.cancelAddPost),$timeout(function(){$("#thread-"+vm.thread.id+" a.dropdown-button").dropdown({constrain_width:!1,alignment:"right"})},500)},vm.setThreadValues=function(data){vm.id=data.id,vm.label=data.label,vm.description=data.description,vm.posts=data.posts,vm.adminEditing=data.adminEditing,vm.scale=data.scale},vm.updateThread=function(e,data){data.id===vm.thread.id&&vm.setThreadValues(data)},vm.updateScale=function(scaleId,e){vm.thread.updateScale(scaleId).then(function(result){vm.scale=vm.thread.scale})},vm.setupEditScaleModal=function(scaleId,label,maxPoints,scaleType){vm.scaleId=void 0===scaleId||null===scaleId?0:scaleId,vm.scaleLabel=void 0===label||null===label?"":label,vm.scaleMaxPoints=void 0===maxPoints||null===maxPoints?"":maxPoints,vm.scaleType=void 0===scaleType||null===scaleType?1:Number(scaleType),vm.isScaleMaxPointsActive=vm.scaleMaxPoints>0,vm.isScaleLabelActive=vm.scaleLabel.length>0},vm.saveScale=function(){vm.thread.scale.save({id:vm.scaleId,label:vm.scaleLabel,maxPoints:vm.scaleMaxPoints,type:vm.scaleType}).then(function(result){vm.thread.updateScale(result.id).then(function(result){console.log("Updated:",vm.thread.scale),vm.scale=vm.thread.scale})})},vm.initialize()}angular.module("campfire-client").directive("campfireThread",function(Thread){return{replace:!0,scope:{},bindToController:{thread:"="},restrict:"E",templateUrl:"/apps/campfire/client/dev/thread/view.html",controller:["$scope","$timeout","Thread","Scale","User",ThreadCtrl],controllerAs:"thread"}})}(),function(){"use strict";angular.module("campfire-client").factory("Thread",function($q,$http,Post,Scale){var threads=[],Thread=function(id,label,description,forum,posts,scale,version){this.update({id:id,label:label,description:description,forum:forum,scale:scale}),this.version=version,this.posts=angular.isArray(posts)?Post.transformer(posts):[],this.adminEditing=!1};return Thread.prototype={addPost:function(){var d=$q.defer(),thread=this,newPost=Post["new"](null,null,thread.id);return newPost.save({body:""}).then(function(result){result.editing=!0,result.isNew=!0,thread.posts.length>0?thread.posts.unshift(result):thread.posts.push(result),d.resolve(result)}),d.promise},getPosts:function(){var thread=this,d=$q.defer();return Thread.getPosts(thread.id).then(function(result){thread.posts=result,d.resolve(result)}),d.promise},modelProps:["id","label","description","forum"],save:function(form_data){var thread=this;angular.forEach(form_data,function(val,key){_.includes(thread.modelProps,key)&&(thread[key]=val)});var url="/apps/campfire/api/thread/save",data={label:this.label,description:this.description,scale:this.scale.id?this.scale.id:null};null===this.id||0===this.id?(console.log("New thread"),data.forum=this.forum):(console.log("Edit thread"),url+="/"+this.id);var d=$q.defer();return thread.loading=!0,console.log(data),$http.post(url,data).then(function(result){thread.update(result.data),console.log(result.data),thread.loading=!1,d.resolve(thread)}),d.promise},update:function(data){this.id=data.id,this.label=data.label,this.description=data.description,this.forum=data.forum,this.scale=Scale.transformer(data.scale),void 0===this.scale.label&&(this.scale.label="Select scale...")},updateScale:function(scaleId){var d=$q.defer(),thread=this;return $http.post("/apps/campfire/api/thread/update_scale/"+this.id+"/"+scaleId).then(function(result){console.log("Saved scale to thread."),thread.scale=Scale.transformer(result.data),d.resolve(result.data)}),d.promise}},Thread.get=function(threadId){var d=$q.defer();return $http.get("/apps/campfire/api/thread/get/"+threadId).then(function(result){var data=Thread.transformer(result.data);d.resolve(data)}),d.promise},Thread.getList=function(options){var d=$q.defer();return $http.get("/apps/campfire/api/thread/get_list",options).then(function(result){var data=Thread.transformer(result.data);d.resolve(data)}),d.promise},Thread.getPosts=function(threadId){var d=$q.defer();return $http.get("/apps/campfire/api/thread/get_posts/"+threadId).then(function(result){var data=[];null!==result.data&&(data=Post.transformer(result.data)),d.resolve(data)}),d.promise},Thread["delete"]=function(threadId){var d=$q.defer();return $http.get("/apps/campfire/api/thread/delete/"+threadId).then(function(result){d.resolve(result.data)}),d.promise},Thread.build=function(data){return data?new Thread(data.id,data.label,data.description,data.forum,data.posts,data.scale,data.version):new Thread},Thread.transformer=function(data){return angular.isArray(data)?data.map(Thread.build):Thread.build(data)},Thread})}(),function(){"use strict";angular.module("campfire-client").factory("User",function($q,$http){var User=function(id,username,firstName,lastName,email,name,accessLevel){this.id=Number(id),this.username=username,this.firstName=firstName,this.lastName=lastName,this.email=email,this.name=name,this.accessLevel=accessLevel};return User.prototype={},User.get=function(userId){var d=$q.defer();return $http.get("/apps/campfire/api/user/get/"+userId).then(function(result){var data=User.transformer(result.data);d.resolve(data)}),d.promise},User.getList=function(options){var d=$q.defer();return $http.get("/apps/campfire/api/user/get_list",options).then(function(result){var data=User.transformer(result.data);d.resolve(data)}),d.promise},User.build=function(data){return data?new User(data.id,data.username,data.firstName,data.lastName,data.email,data.name,data.accessLevel):new User},User.activeUser=null,User.loadActiveUser=function(){if(null===User.activeUser){var d=$q.defer();return $http.get("/apps/campfire/api/user/get_active/").then(function(result){User.activeUser=User.transformer(result.data),d.resolve(User.activeUser)}),d.promise}return User.activeUser},User.transformer=function(data){return angular.isArray(data)?data.map(User.build):User.build(data)},User})}(),function(){"use strict";angular.module("campfire-client").factory("Version",function($q,$http,Forum){var versions=[],Version=function(id,name,courseCode,courseName,programName,numForums,forums){this.id=id,this.name=name,this.courseCode=courseCode,this.courseName=courseName,this.programName=programName,this.numForums=numForums,this.forums=Forum.transformer(forums),this.hasForums=!!(this.forums&&this.forums.length>0)};return Version.prototype={cloneForum:function(forum){var version=this,clone=new Forum(null,forum.label,forum.description,forum.version);clone.save().then(function(result){version.forums.push(result),version.hasForums=!0})},deleteForum:function(forumId){var version=this,d=$q.defer(),forum=_.find(version.forums,{id:forumId});return forum?(console.log("Found forum: ",forum),$http.get("/apps/campfire/api/forum/delete/"+forum.id).then(function(result){_.remove(version.forums,forum),d.resolve(result)}),d.promise):(console.log("Couldn't find forum. ",forum),!1)},saveForum:function(data){var d=$q.defer(),version=this,isNew=!1,forum;return data.id>0?forum=_.find(version.forums,{id:data.id}):(data.version=version.id,forum=new Forum(null),isNew=!0),forum.save(data).then(function(result){isNew&&version.forums.push(result),version.hasForums=!0,d.resolve(result)}),d.promise}},Version.get=function(versionId){var d=$q.defer();return $http.get("/apps/campfire/api/version/get/"+versionId).then(function(result){var data=Version.transformer(result.data);d.resolve(data)}),d.promise},Version.getAll=function(){var d=$q.defer();return $http.get("/apps/campfire/api/version/all").then(function(result){var data=Version.transformer(result.data);d.resolve(data)}),d.promise},Version.build=function(data){return data?new Version(data.versionID?data.versionID:data.id,data.name,data.courseCode,data.courseName,data.programName,data.num_forums?data.num_forums:data.numForums,data.forums):new Version},Version.transformer=function(data){return angular.isArray(data)?data.map(Version.build):Version.build(data)},Version})}(),function(){"use strict";function ScaleNumericCtrl($scope,$interval,User){var vm=this;vm.initialize=function(){vm.scale=vm.post.scale,vm.score=vm.post.scale.score},vm.setScore=function(e){vm.post.scale.setScore(vm.score),$scope.$emit("scale:setScore",vm.post.scale.score)},vm.initialize()}angular.module("campfire-client").directive("campfireScaleNumeric",function(){return{replace:!0,scope:{},bindToController:{post:"="},restrict:"E",templateUrl:"/apps/campfire/client/dev/scale/numeric/view.html",controller:["$scope","$interval","User",ScaleNumericCtrl],controllerAs:"vm"}})}(),function(){"use strict";function ScaleCustomCtrl($scope,User){var vm=this;vm.initialize=function(){vm.scale=vm.post.scale,vm.score=vm.post.scale.score},vm.setScore=function(e){vm.post.scale.setScore(vm.score),$scope.$emit("scale:setScore",vm.post.scale.score)},vm.initialize()}angular.module("campfire-client").directive("campfireScaleCustom",function(){return{replace:!0,scope:{},bindToController:{post:"="},restrict:"E",templateUrl:"/apps/campfire/client/dev/scale/custom/view.html",controller:["$scope","User",ScaleCustomCtrl],controllerAs:"vm"}})}(),function(){"use strict";angular.module("campfire-client").factory("Post",function($q,$http,User,Scale){var Post=function(id,body,posts,user,date_posted,date_updated,parent,section,thread,scale,authorViewing,score,date_scored,grader,isUnread){User.loadActiveUser(),this.update({id:id,body:body,user:user,date_posted:date_posted,date_updated:date_updated}),this.score=score?Number(score):null,this.parent=parent,this.section=section,this.thread=thread,this.posts=angular.isArray(posts)?Post.transformer(posts):[],this.isUnread=isUnread,this.hasPosts=this.posts.length>0,this.isMine=this.user.id===User.activeUser.id,this.notMine=!this.isMine,this.editing=!1,this.isNew=!1,this.scale=Scale.transformer(scale),this.scale.setScore(this.score),this.authorViewing=authorViewing,this.date_scored=Date.parse(date_scored),this.grader=grader};return Post.prototype={modelProps:["id","body","user","date_posted","date_updated","section","parent"],addReply:function(){var d=$q.defer(),post=this,newPost=Post["new"](post.id,post.section,post.thread);return newPost.save({body:""}).then(function(result){result.editing=!0,result.isNew=!0,post.posts.unshift(result),d.resolve(result)}),d.promise},"delete":function(){var d=$q.defer();return $http.get("/apps/campfire/api/post/delete/"+this.id).then(function(result){d.resolve(result)}),d.promise},markAsRead:function(){var post=this,d=$q.defer();return $http.get("/apps/campfire/api/post/mark_read/"+this.id).then(function(result){post.isUnread=!1,d.resolve(result.data)}),d.promise},save:function(form_data){var post=this;angular.forEach(form_data,function(val,key){_.includes(post.modelProps,key)&&(post[key]=val)});var url="/apps/campfire/api/post/save";console.log("Date: ",this.date_updated);var data={body:this.body,date_updated:this.date_updated.toString("s")};null===this.id||0===this.id?(data.date_posted=data.date_updated,data.user=this.user.id,data.section=this.section,data.parent=this.parent,data.thread=this.thread):url+="/"+this.id,console.log(data);var d=$q.defer();return post.loading=!0,$http.post(url,data).then(function(result){post.update(result.data),d.resolve(post),post.loading=!1,post.isNew=!1}),d.promise},saveScore:function(score){var d=$q.defer();return $http.post("/apps/campfire/api/post/save_score/"+this.id+"/"+score).then(function(result){d.resolve(result.data)}),d.promise},update:function(data){this.id=data.id,this.body=data.body,data.user instanceof User?this.user=data.user:this.user=User.transformer(data.user),this.date_posted=Date.parse(data.date_posted),console.log("Date posted for "+this.id,this.date_posted),this.date_updated=Date.parse(data.date_updated)}},Post["new"]=function(parent,section,thread){return new Post(null,"",[],User.activeUser,Date.today().setTimeToNow(),Date.today().setTimeToNow(),parent,section,thread)},Post.get=function(postId){var d=$q.defer();return $http.get("/apps/campfire/api/post/get/"+postId).then(function(result){var data=Post.transformer(result.data);d.resolve(data)}),d.promise},Post.getList=function(options){var d=$q.defer();return $http.get("/apps/campfire/api/post/get_list",options).then(function(result){var data=Post.transformer(result.data);d.resolve(data)}),d.promise},Post.build=function(data){return data?new Post(data.id,data.body,data.posts,data.user,data.date_posted,data.date_updated,data.parent,data.section,data.thread,data.scale,data.authorViewing,data.score,data.date_scored,data.grader,data.isUnread):new Post},Post.transformer=function(data){return angular.isArray(data)?data.map(Post.build):Post.build(data)},Post})}(),function(){"use strict";function PostCtrl($scope,$interval,Post,Scale,User){var vm=this;vm.isCreditScale=!1,vm.isNumericScale=!1,vm.isCustomScale=!1,vm.graderViewing=!1,vm.studentViewing=!1,vm.markingAsRead=!1,vm.edit=function(id,e){vm.loading=!0,vm.editing=!0,vm.interval=$interval(vm.checkForEditableArea,250)},vm.cancel=function(e){e.preventDefault(),vm.editing=vm.post.editing=!1,vm.post.isNew&&vm["delete"](e)},vm.cancelDelete=function(e){e.preventDefault()},vm.checkForEditableArea=function(){var postId="#post-"+vm.post.id,elem=$(postId+"-body");elem.length>0&&($interval.cancel(vm.interval),tinyMCEInit("#"+elem.attr("id")),vm.loading=!1)},vm["delete"]=function(id,e){e&&e.preventDefault();var isNew=vm.post.isNew;vm.post["delete"]().then(function(){$scope.$emit("post:delete",{post:vm.post,isNew:isNew})})},vm.reply=function(id,e){vm.loading=!0,vm.post.addReply().then(function(result){vm.hasPosts=vm.post.hasPosts=!0,vm.loading=!1})},vm.save=function(e){e.preventDefault(),vm.loading=!0;var postId="#post-"+vm.post.id,data={body:$(postId+"-body").val(),date_updated:Date.today().setTimeToNow()};vm.post.save(data).then(function(result){angular.forEach(vm.post,function(val,key){vm[key]=val}),vm.loading=!1,vm.editing=vm.post.editing=!1,Materialize.toast("Post saved successfully.",3e3)})},vm.saveScore=function(e,score){vm.post.saveScore(score)},vm.toggleVisibility=function(id,e){},vm.initialize=function(){User.loadActiveUser(),angular.forEach(vm.post,function(val,key){vm[key]=val}),vm.loading=!1,vm.graderViewing=vm.post.scale.graderViewing,vm.authorViewing=vm.post.authorViewing,activateMaterialize("Post directive: "+vm.id),vm.editing&&vm.edit(),$(".modal-trigger").leanModal(),vm.isCreditScale=Number(vm.scale.type.id)===Scale.creditScale,vm.isNumericScale=Number(vm.scale.type.id)===Scale.numericScale,vm.isCustomScale=Number(vm.scale.type.id)===Scale.customScale,vm.post.isUnread&&$interval(function(){var top=$("#post-"+vm.post.id).offset().top;$(document).on("scroll",function(e){$(document).scrollTop()+300>=top&&vm.markAsRead()})},500,1),$scope.$on("post:delete",vm.childDeleted),$scope.$on("scale:setScore",vm.saveScore)},vm.childDeleted=function(e,data){if(_.includes(vm.post.posts,data.post)){e.stopPropagation(),_.pull(vm.post.posts,data.post);var msg="Post deleted successfully.";data.isNew&&(msg="Post cancelled."),Materialize.toast(msg,3e3)}},vm.markAsRead=function(e){vm.markingAsRead||(vm.markingAsRead=!0,vm.post.markAsRead().then(function(result){console.log(result),vm.isUnread=!1}))},vm.initialize()}angular.module("campfire-client").directive("campfirePost",function(){return{replace:!0,scope:{},bindToController:{post:"="},restrict:"E",templateUrl:"/apps/campfire/client/dev/post/view.html",controller:["$scope","$interval","Post","Scale","User",PostCtrl],controllerAs:"post"}})}();
//# sourceMappingURL=./app.js.map