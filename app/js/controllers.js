'use strict';

/* Controllers */

var areviaControllers = angular.module('areviaControllers', ['angularFileUpload']);

areviaControllers.controller('AppCtrl',['$scope','AuthService', function ($scope,AuthService) {
	$scope.section = 0;
	$scope.isAuthorized = AuthService.isAuthorized;
	var now = new Date().getFullYear();
	$scope.age = now - 1964;
}]);

areviaControllers.controller('NavCtrl',['$scope','$location', function ($scope, $location) {
	$scope.getPath = function () {
		return ($location.path() === '/leMondeDArevia') ? true : false;
	};
}]); // End NavCtrl

areviaControllers.controller('ContactCtrl',['$scope','MailService','$rootScope','MAIL_EVENTS', function ($scope,MailService,$rootScope,MAIL_EVENTS) {
	$scope.sendEmail = function (mail) {
		$scope.loading = true;
		MailService.post(mail).then(function (res) {
			$scope.mail = "";
			$scope.contactForm.$setPristine();
			$scope.loading = false;
			$rootScope.$broadcast(MAIL_EVENTS.sendSuccess);
		}, function () {
			$scope.loading = false;
			$rootScope.$broadcast(MAIL_EVENTS.sendFailed);
		});
	};

}]); // End ContactCtrl

areviaControllers.controller('BlogCtrl', ['$scope','ArticleService','$timeout','$rootScope','FileService','ARTICLE_EVENTS','PostsService','AuthService','AUTH_EVENTS','$location','POSTS_EVENTS', function ($scope,ArticleService,$timeout,$rootScope,FileService,ARTICLE_EVENTS,PostsService,AuthService,AUTH_EVENTS,$location,POSTS_EVENTS) {

	$rootScope.display = function () {
		ArticleService.get().then(function (res) {
			for(var i = 0; i < res.length; i++){
				res[i].img_path = res[i].img_path;
			}
			$scope.articles = res;
			$scope.articlePolling = $timeout($scope.display, 3600);
		}, function () {
			$rootScope.message = "Il n'y a pas d'articles !";
			$scope.articles = null;
			$rootScope.$broadcast(ARTICLE_EVENTS.selectFailed);
			$timeout($scope.display, 3600);
		});
	};// End Display()

	$scope.fullArticle = function (article) {
		$timeout.cancel($scope.articlePolling);
		$rootScope.currentArticle = article;
		$j('#articleModal').modal('show');
		PostsService.get(article.id).then(function (res) {
			$rootScope.currentArticlePosts = res;
			$rootScope.messagePost = null;
			$scope.displayPost();
		}, function () {
			$rootScope.currentArticlePosts = null;
			$rootScope.messagePost = "Il n'y a pas de commentaires!";
			$scope.displayPost();
		});
	}; // End FullArticle

	$j('#articleModal').on('hidden.bs.modal', function(e) {
		$timeout.cancel($scope.postPolling);
	});

	$scope.displayPost = function () {
		PostsService.get($rootScope.currentArticle.id).then(function (res) {
			$rootScope.currentArticlePosts = res;
			$rootScope.messagePost = null;
			$scope.postPolling = $timeout($scope.displayPost, 3600);
		}, function () {
			$rootScope.currentArticlePosts = null;
			$rootScope.messagePost = "Il n'y a pas de commentaires!";
			$timeout($scope.displayPost, 3600);
		});
	};

	// When user try to log out
	$scope.signOut = function () {
		AuthService.logout().then(function (res) {
			$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
			$location.path('/');
		});

	}; // End logout()

	$scope.OpenDeleteArticle = function (article) {
		$rootScope.delArticle = article;
		$j('#deleteArticleModal').modal('show');
	};

	$scope.deleteArticle = function () {
		FileService.delete($rootScope.delArticle.id).then(function () {
			ArticleService.delete($rootScope.delArticle.id).then(function () {
				$rootScope.$broadcast(ARTICLE_EVENTS.deleteSuccess);
			}, function () {
				$rootScope.$broadcast(ARTICLE_EVENTS.deleteFailed);
			});
		});
	};

	$scope.deletePost = function () {
		PostsService.delete($rootScope.delPost).then(function () {
			$rootScope.$broadcast(POSTS_EVENTS.deleteSuccess);
		}, function () {
			$rootScope.$broadcast(POSTS_EVENTS.deleteFailed);
		});
	};
}]);

areviaControllers.controller('PostCtrl',['$scope','$rootScope','PostsService','POSTS_EVENTS','ARTICLE_EVENTS', function ($scope,$rootScope,PostsService,POSTS_EVENTS,ARTICLE_EVENTS) {

	$scope.addPost = function (id) {
		var com = {
			id: id,
			content: $scope.posts.message,
			firstname: $scope.posts.firstname,
			email: $scope.posts.email
		};
		PostsService.post(com).then(function (res){
			$rootScope.$broadcast(POSTS_EVENTS.postSuccess);
		}, function (res) {
			$rootScope.$broadcast(POSTS_EVENTS.postFailed);
		});

		// Reset Form After Submitting
		$scope.posts = "";
		$scope.postsForm.$setPristine();

	};

	$scope.OpenDeletePost = function (id) {
		$rootScope.delPost = id;
		$j('#deletePostModal').modal('show');
	};

}]);

areviaControllers.controller('AuthCtrl',['$scope','AuthService','$rootScope','$route','AUTH_EVENTS','AuthInterceptor', function ($scope,AuthService,$rootScope,$route,AUTH_EVENTS,AuthInterceptor) {

	$rootScope.currentUser = null;
	$scope.credentials = {
		login: '',
		password: ''
	};

	$scope.signIn = function (credentials) {

		AuthService.login(credentials).then(function (user) {
			$rootScope.currentUser = user;
			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
			$j('#connexionModal').modal('hide');
			$route.reload();
		}, function (res) {
			res.status = parseInt(res.data)
			AuthInterceptor.responseError(res);
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		});

	}; // End singIn()

}]);

areviaControllers.controller('ArticleCtrl',['$scope','FileService','FILE_EVENTS','ARTICLE_EVENTS','ArticleService','$rootScope','$upload', function ($scope,FileService,FILE_EVENTS,ARTICLE_EVENTS,ArticleService,$rootScope,$upload) {

	$scope.imgIsEnable = false;
	$scope.dismissModal = false;

	// Waiting for a Drop
	$scope.$watch('files', function () {
		$scope.upload();
	});

	// When Image is Dropped
	$scope.upload = function () {
		// Get Image Path
		angular.forEach(FileService.update($scope.files, '/Arevia/RESTapi/public/api/article/setPicture'), function (promise) {
			promise.then(function (res) {
				$scope.imgIsEnable = !!res;
				$scope.fileName = res.data;
				$rootScope.$broadcast(FILE_EVENTS.uploadSuccess);
			}, function () {
				$rootScope.$broadcast(FILE_EVENTS.updateFailed);
			});	
		});
	};

	// When Form is Submitted
	$scope.addArticle = function() {

		// Article Creation (JSON)
		$scope.article = {
			title: $scope.inputs.title,
			content: $scope.inputs.content,
			img_path: $scope.fileName
		};

		// Send Article To ArticleService
		ArticleService.post($scope.article).then(function (res) {
			$rootScope.$broadcast(ARTICLE_EVENTS.postSuccess);
			$j('#addArticleModal').modal('hide');
			$rootScope.message = "";
		}, function () {
			$rootScope.$broadcast(ARTICLE_EVENTS.postFailed);
		});

		// Reset Form After Submitting
		$scope.inputs = "";
		$scope.imgIsEnable = false;
		$scope.addArticleForm.$setPristine();

	}; // End addArticle()

}]);