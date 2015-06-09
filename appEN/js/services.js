'use strict';

/* Services */

var areviaServices = angular.module('areviaServices', ['ngResource']);

areviaServices.factory('MailService',['$http', function ($http) {

	var mailService = {};

	mailService.post = function (mail) {
		return $http
		.post('/Arevia/RESTapi/public/api/mail', mail);
	};
	
	return mailService;

}]);

areviaServices.factory('PostsService',['$http', function ($http) {

	var postService = {};

	postService.post = function (com) {
		return $http
		.post('/Arevia/RESTapi/public/api/post', com);
	};

	postService.get = function (id) {
		return $http
		.get('/Arevia/RESTapi/public/api/post/'+id)
		.then(function (res) {
			return res.data;
		});

	}; // End get()

	// Delete Post
	postService.delete = function (id) {

		return $http
		.delete('/Arevia/RESTapi/public/api/post/'+id)
		.then(function (res) {
			return res.data;
		});

	};// End delete()

	return postService;
}]);

areviaServices.factory('AuthService',['$http','Session','$rootScope', function ($http, Session, $rootScope) {

	var authService = {};

	// Login
	authService.login = function (credentials) {

		return $http
		.post('/Arevia/RESTapi/public/user/login', credentials)
		.then(function (res) {
			Session.create(res.data.id, res.data.user.id, res.data.user.login);
			return res.data.user;
		});

	}; // End login()

	// Logout
	authService.logout = function () {
		
		return $http
		.get('/Arevia/RESTapi/public/user/logout')
		.then(function (res) {
			$rootScope.currentUser = null;
			Session.destroy();
		});

	}; // End logout()

	// Verification of authentication
	authService.isAuthenticated = function () {
		return !!Session.userId;

	}; // End isAuthenticated()

	// retrieve the current user if he is authenticated
	authService.retrieveUser = function () {
		
		return $http
		.get('/Arevia/RESTapi/public/api/user')
		.then(function (res) {
			if(res.data !== "0"){
				Session.create(res.data.id, res.data.user.id, res.data.user.role);
				return res.data.user;
			} else {
				return null;
			}
		}, function () {
			return null;
		});

	} // End retrieveUser

	return authService;

}]);

areviaServices.factory('FileService',['$http','$rootScope','$upload', function ($http, $rootScope, $upload) {

	var fileService = {};

	// When an image is uploaded
	fileService.update = function (files, url) {
		
		var promises = [];

		if (files && files.length) {

			for (var i = 0; i < files.length; i++) {
				var file = files[i];

				var promise = $upload.upload({
					url: url,
					headers: {
						nom: file.name
					},
					file: file
				}).progress(function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				}).success(function (data, status, headers, config) {
					return data;
				});
				promises.push(promise);
			}
		}
		
		return promises;

	}; // End update()

	fileService.delete = function (id) {
		return $http
		.delete('/Arevia/RESTapi/public/api/file/'+id)
		.then(function (res) {
			return res.data;
		});
	};

	return fileService;

}]); // End  FileService

areviaServices.factory('ArticleService',['$http','$rootScope', function ($http, $rootScope) {

	var articleService = {};

	// Display All/Sorted Articles
	articleService.get = function () {
		return $http
		.get('/Arevia/RESTapi/public/api/article')
		.then(function (res) {
			return res.data;
		});

	};// End get()


	// Add Article
	articleService.post = function (article) {

		return $http
		.post('/Arevia/RESTapi/public/api/article', article);

	}; // End post()

	// Delete Article
	articleService.delete = function (id) {

		return $http
		.delete('/Arevia/RESTapi/public/api/article/'+id)
		.then(function (res) {
			return res.data;
		});

	};// End delete()

	return articleService;

}]); // End Service Post/Delete Article (Admin)

areviaServices.factory('Session', function () {

	var Session = {};

	Session.create = function (sessionId, userId, userLogin) {
		
		Session.id = sessionId;
		Session.userId = userId;
		Session.userLogin = userLogin;

	}; // End create()

	Session.destroy = function () {

		Session.id = null;
		Session.userId = null;
		Session.userLogin = null;

	}; // End destroy()

	return Session;

});// End Session


areviaServices.factory('AuthInterceptor',['$rootScope','$q','AUTH_EVENTS','FILE_EVENTS','ARTICLE_EVENTS','POSTS_EVENTS','MAIL_EVENTS', function ($rootScope, $q, AUTH_EVENTS, FILE_EVENTS, ARTICLE_EVENTS, POSTS_EVENTS, MAIL_EVENTS) {

	return {

		responseError: function (response) { 

			$rootScope.$broadcast({
				401: AUTH_EVENTS.notAuthenticated,
				403: AUTH_EVENTS.notAuthorized,
				419: AUTH_EVENTS.sessionTimeout,
				440: AUTH_EVENTS.sessionTimeout,
				441: FILE_EVENTS.uploadFailed,
				442: FILE_EVENTS.getFailed,
				450: ARTICLE_EVENTS.postFailed,
				451: ARTICLE_EVENTS.selectFailed,
				452: ARTICLE_EVENTS.deleteFailed,
				460: POSTS_EVENTS.postFailed,
				461: POSTS_EVENTS.deleteFailed,
				470: MAIL_EVENTS.sendFailed
			}[response.status], response);

			return $q.reject(response);
		}// End responseError

	};// End Return

}]);// End AuthInterceptor

areviaServices.factory('AuthResolver',['$q','$rootScope','$location', function ($q, $rootScope, $location) {
	return {

		resolve: function (redirectAuth, redirectNotAuth) {

			var deferred = $q.defer();
			var unwatch = $rootScope.$watch('currentUser', function (currentUser) {

				if (angular.isDefined(currentUser)) {
					
					if (currentUser) {
						deferred.resolve(currentUser);
						if(angular.isString(redirectAuth)) $location.path(redirectAuth);
					} else {
						if(angular.isString(redirectNotAuth)) {
							deferred.reject();
							$location.path(redirectNotAuth);
						} else if(redirectNotAuth) {
							$location.path('/');
						}else {
							deferred.resolve();
						}
					}
					unwatch();
				}

			});// End watch()

			return deferred.promise;
		}// End resolve

	};// End return

}]);// End AuthResolver

areviaServices.factory('SessionResolver',['$q','$rootScope','$location','Session', function ($q, $rootScope, $location, Session) {
	
	return {
		
		resolve: function () {
			
			var def = $q.defer();
			return $rootScope.deferred.promise.then(function () {
				def.resolve();
				$rootScope.$broadcast('$routeChangeStart');
				return def.promise;

			});// End return

		}// End resolve

	};// End return

}]);// End SessionResolver
