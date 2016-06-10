function activateMaterialize(source){$(".collapsible").collapsible()}function tinyMCEInit(selector){console.log("Activating TinyMCE on "+selector),tinymce.init({selector:selector,menubar:!1,plugins:"link",toolbar:["undo redo | bold italic | bullist numlist | outdent indent blockquote | underline superscript subscript | link | removeformat"],setup:function(editor){editor.on("change",function(){editor.save()})}})}!function(){"use strict";var app=angular.module("campfire-client",["ngSanitize","ngRoute"]);app.config(function($routeProvider){$routeProvider.when("/",{controller:"mainCtrl",controllerAs:"main",templateUrl:"./client/dev/main/view.html"}).when("/forum/:forumId/",{controller:"forumCtrl",controllerAs:"forum",templateUrl:"./client/dev/forum/view.html"}).when("/thread/:threadId/",{controller:"threadCtrl",controllerAs:"thread",templateUrl:"./client/dev/thread/view.html"}).when("/post/:postId/",{controller:"postCtrl",controllerAs:"post",templateUrl:"./client/dev/post/view.html"}).otherwise({redirectTo:"/"})}).value("$",window.$)}(),function(){"use strict";angular.module("campfire-client").factory("User",function($q,$http){var User=function(id,username,firstName,lastName,email,name,accessLevel){this.id=Number(id),this.username=username,this.firstName=firstName,this.lastName=lastName,this.email=email,this.name=name,this.accessLevel=accessLevel};return User.prototype={},User.get=function(userId){var d=$q.defer();return $http.get("api/user/get/"+userId).then(function(result){var data=User.transformer(result.data);d.resolve(data)}),d.promise},User.getList=function(options){var d=$q.defer();return $http.get("api/user/get_list",options).then(function(result){var data=User.transformer(result.data);d.resolve(data)}),d.promise},User.build=function(data){return data?new User(data.id,data.username,data.firstName,data.lastName,data.email,data.name,data.accessLevel):new User},User.activeUser=new User(1337970,"philschanely","Phil","Schanely","philschanely@cedarville.edu","Phil Schanely",{id:1,name:"Super Admin",order:1}),User.transformer=function(data){return angular.isArray(data)?data.map(User.build):User.build(data)},User})}(),function(){"use strict";angular.module("campfire-client").factory("Main",function($q,$http,Forum){var Main=function(){};return Main.prototype={forums:[]},Main.forums=[],Main.getForumsForVersion=function(versionID){var d=$q.defer();return $http.get("api/forum/all_for_version/"+versionID).then(function(result){var data=Forum.transformer(result.data);d.resolve(data)}),d.promise},Main})}(),function(){"use strict";angular.module("campfire-client").factory("Forum",function($q,$http,Thread){var forums=[],Forum=function(id,label,description,threads){this.id=id,this.label=label,this.description=description,this.threads=Thread.transformer(threads)};return Forum.prototype={},Forum.get=function(forumId){var d=$q.defer();return $http.get("api/forum/get/"+forumId).then(function(result){var data=Forum.transformer(result.data);d.resolve(data)}),d.promise},Forum.getList=function(options){var d=$q.defer();return $http.get("api/forum/get_list",options).then(function(result){var data=Forum.transformer(result.data);d.resolve(data)}),d.promise},Forum.build=function(data){return data?new Forum(data.id,data.label,data.description,data.threads):new Forum},Forum.transformer=function(data){return angular.isArray(data)?data.map(Forum.build):Forum.build(data)},Forum})}(),function(){"use strict";angular.module("campfire-client").factory("Thread",function($q,$http,Post){var threads=[],Thread=function(id,label,description,posts){this.id=id,this.label=label,this.description=description,this.posts=angular.isArray(posts)?Post.transformer(posts):[]};return Thread.prototype={getPosts:function(){var thread=this,d=$q.defer();return Thread.getPosts(thread.id).then(function(result){thread.posts=result,d.resolve(result),console.log("Updated thread",thread)}),d.promise}},Thread.get=function(threadId){var d=$q.defer();return $http.get("api/thread/get/"+threadId).then(function(result){var data=Forum.transformer(result.data);d.resolve(data)}),d.promise},Thread.getList=function(options){var d=$q.defer();return $http.get("api/thread/get_list",options).then(function(result){var data=Thread.transformer(result.data);d.resolve(data)}),d.promise},Thread.getPosts=function(threadId){var d=$q.defer();return $http.get("api/thread/get_posts/"+threadId).then(function(result){var data=Post.transformer(result.data);d.resolve(data)}),d.promise},Thread.build=function(data){return data?new Thread(data.id,data.label,data.description,data.posts):new Thread},Thread.transformer=function(data){return angular.isArray(data)?data.map(Thread.build):Thread.build(data)},Thread})}(),function(){"use strict";angular.module("campfire-client").factory("Post",function($q,$http,User){var Post=function(id,body,posts,user,date_posted,date_updated,parent,section,thread){this.update({id:id,body:body,user:user,date_posted:date_posted,date_updated:date_updated}),this.parent=parent,this.section=section,this.thread=thread,this.posts=angular.isArray(posts)?Post.transformer(posts):[],this.hasPosts=this.posts.length>0,this.isMine=this.user.id===User.activeUser.id,this.notMine=!this.isMine,this.editing=!1};return Post.prototype={modelProps:["id","body","user","date_posted","date_updated","section","parent"],addReply:function(){var d=$q.defer(),post=this,newPost=new Post(null,"",[],User.activeUser,Date.today().setTimeToNow(),Date.today().setTimeToNow(),post.id,post.section,post.thread);return newPost.save({body:""}).then(function(result){result.editing=!0,post.posts.unshift(result),d.resolve(result)}),d.promise},"delete":function(){var d=$q.defer();return $http.get("api/post/delete/"+this.id).then(function(result){d.resolve(result)}),d.promise},save:function(form_data){var post=this;angular.forEach(form_data,function(val,key){_.includes(post.modelProps,key)&&(post[key]=val)});var url="api/post/save",data={body:this.body,date_updated:Date.parse(this.date_updated).toString("u").replace("Z","")};null===this.id||0===this.id?(data.date_posted=data.date_updated,data.user=this.user.id,data.section=this.section,data.parent=this.parent,data.thread=this.thread):url+="/"+this.id;var d=$q.defer();return post.loading=!0,$http.post(url,data).then(function(result){post.update(result.data),d.resolve(post),post.loading=!1}),d.promise},update:function(data){this.id=data.id,this.body=data.body,data.user instanceof User?this.user=data.user:this.user=User.transformer(data.user),this.date_posted=Date.parse(data.date_posted),this.date_updated=Date.parse(data.date_updated)}},Post.get=function(postId){var d=$q.defer();return $http.get("api/post/get/"+postId).then(function(result){var data=Post.transformer(result.data);d.resolve(data)}),d.promise},Post.getList=function(options){var d=$q.defer();return $http.get("api/post/get_list",options).then(function(result){var data=Post.transformer(result.data);d.resolve(data)}),d.promise},Post.build=function(data){return data?new Post(data.id,data.body,data.posts,data.user,data.date_posted,data.date_updated,data.parent,data.section,data.thread):new Post},Post.transformer=function(data){return angular.isArray(data)?data.map(Post.build):Post.build(data)},Post})}(),function(){"use strict";angular.module("campfire-client").controller("mainCtrl",function($scope,Main,Forum){var vm=this;vm.courseVersion={id:1},vm.label="Forums",vm.forums=[];var initialize=function(){Main.getForumsForVersion(vm.courseVersion.id).then(function(result){vm.forums=result})};initialize()})}(),function(){"use strict";angular.module("campfire-client").controller("forumCtrl",function($routeParams,$scope,Forum){var vm=this;vm.forum={},vm.initialize=function(){Forum.get($routeParams.forumId).then(function(result){vm.forum=result}),activateMaterialize("Forum controller")},vm.getPosts=function(e){},vm.initialize()})}(),function(){function MastheadCtrl($scope){var vm=this;vm.initialize=function(){},vm.initialize()}angular.module("campfire-client").directive("campfireMasthead",function(){return{replace:!0,scope:{},restrict:"E",templateUrl:"./client/dev/masthead/view.html",controller:["$scope",MastheadCtrl],controllerAs:"mhead"}})}(),function(){function FooterCtrl($scope){var vm=this;vm.initialize=function(){},vm.initialize()}angular.module("campfire-client").directive("campfireFooter",function(){return{replace:!0,scope:{},restrict:"E",templateUrl:"./client/dev/footer/view.html",controller:["$scope",FooterCtrl],controllerAs:"foot"}})}(),function(){"use strict";function ThreadCtrl($scope,Thread){var vm=this;vm.posts=[],vm.has_posts=!1,vm.getPosts=function(){vm.thread.getPosts().then(function(result){vm.posts=result,vm.has_posts=vm.posts.length>0})},vm.initialize=function(){activateMaterialize("Thread directive"),vm.id=vm.thread.id,vm.label=vm.thread.label,vm.description=vm.thread.description,vm.posts=vm.thread.posts},vm.initialize()}angular.module("campfire-client").directive("campfireThread",function(Thread){return{replace:!0,scope:{},bindToController:{thread:"="},restrict:"E",templateUrl:"./client/dev/thread/view.html",controller:["$scope","Thread",ThreadCtrl],controllerAs:"thread"}})}(),function(){"use strict";function PostCtrl($scope,$interval,Post,User){var vm=this;vm.edit=function(id,e){vm.loading=!0,vm.editing=!0,vm.interval=$interval(vm.checkForEditableArea,250)},vm.cancelDelete=function(e){e.preventDefault()},vm.checkForEditableArea=function(){var postId="#post-"+vm.post.id,elem=$(postId+"-body");elem.length>0&&($interval.cancel(vm.interval),tinyMCEInit("#"+elem.attr("id")),vm.loading=!1)},vm["delete"]=function(id,e){e.preventDefault(),vm.post["delete"]().then(function(){$scope.$emit("post:delete",{post:vm.post})})},vm.reply=function(id,e){vm.loading=!0,vm.post.addReply().then(function(result){vm.hasPosts=vm.post.hasPosts=!0,vm.loading=!1})},vm.save=function(e){e.preventDefault(),vm.loading=!0;var postId="#post-"+vm.post.id,data={body:$(postId+"-body").val(),date_updated:Date.today().setTimeToNow()};vm.post.save(data).then(function(result){angular.forEach(vm.post,function(val,key){vm[key]=val}),vm.loading=!1,vm.editing=vm.post.editing=!1,Materialize.toast("Post saved successfully.",3e3)})},vm.toggleVisibility=function(id,e){},vm.initialize=function(){angular.forEach(vm.post,function(val,key){vm[key]=val}),vm.loading=!1,activateMaterialize("Post directive: "+vm.id),vm.editing&&vm.edit(),$(".modal-trigger").leanModal(),$scope.$on("post:delete",vm.childDeleted)},vm.childDeleted=function(e,data){_.includes(vm.post.posts,data.post)&&(e.stopPropagation(),_.pull(vm.post.posts,data.post),Materialize.toast("Post deleted successfully.",3e3))},vm.initialize()}angular.module("campfire-client").directive("campfirePost",function(){return{replace:!0,scope:{},bindToController:{post:"="},restrict:"E",templateUrl:"./client/dev/post/view.html",controller:["$scope","$interval","Post","User",PostCtrl],controllerAs:"post"}})}();
//# sourceMappingURL=./app.js.map