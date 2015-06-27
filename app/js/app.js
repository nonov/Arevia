'use strict';

/* App Module */

var arevia = angular.module('arevia', ['ngRoute','areviaControllers','areviaServices','ngToast']);

arevia.config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {
	$routeProvider.
	when('/', {
		templateUrl: '/Arevia/app/partials/home.min.html',
		url: '/protected'
	}).
	when('/profil', {
		templateUrl: '/Arevia/app/partials/profil.min.html'
	}).
	when('/influences', {
		templateUrl: '/Arevia/app/partials/influences.min.html'
	}).
	when('/interventions', {
		templateUrl: '/Arevia/app/partials/interventions.min.html'
	}).
	when('/choisirArevia', {
		templateUrl: '/Arevia/app/partials/choisirArevia.min.html'
	}).
	when('/boutique', {
		templateUrl: '/Arevia/app/partials/boutique.min.html'
	}).
	when('/contact', {
		templateUrl: '/Arevia/app/partials/contact.min.html',
		controller: 'ContactCtrl'
	}).
	when('/noNewsletter/:email/:token', {
		templateUrl: '/Arevia/app/partials/noNewsletter.html',
		controller: 'NewsletterCtrl'
	}).
	when('/leMondeDArevia', {
		templateUrl: '/Arevia/app/partials/leMondeDArevia.min.html',
		controller: 'BlogCtrl',
		resolve: {
			session: ['SessionResolver', function resolveSession(SessionResolver) {
				return SessionResolver.resolve();
			}]
		},
		redirection: ['AuthService', function (AuthService) {
			if(AuthService.isAuthenticated()){
				return '/leMondeDArevia';
			}
		}]
	}).
	otherwise({
		redirectTo: '/',
	});

	$locationProvider.html5Mode(false);

}]).run(['$rootScope','AUTH_EVENTS','ARTICLE_EVENTS','FILE_EVENTS','POSTS_EVENTS','MAIL_EVENTS','NEWSLETTER_EVENTS','ngToast','AuthService','$log','Session','$q','$location','$injector','$window', function ($rootScope,AUTH_EVENTS,ARTICLE_EVENTS,FILE_EVENTS,POSTS_EVENTS,MAIL_EVENTS,NEWSLETTER_EVENTS,ngToast,AuthService,$log,Session,$q,$location,$injector,$window) {

	$rootScope.deferred = $q.defer();

	AuthService.retrieveUser().then(function (user) {
		$rootScope.currentUser = user;
		$rootScope.deferred.resolve();

		$rootScope.$on('$routeChangeStart', function (event,next,current) {
			$rootScope.loaded = false;
			if(next && next.data){
				var authorizedRoles = next.data.authorizedRoles;
				if (!AuthService.isAuthorized(authorizedRoles)) {
					event.preventDefault();
					if (AuthService.isAuthenticated()) {
                        // user is not allowed
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                    } else {
                        // user is not logged in
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                    }
                }
            }
        });
	});

	$rootScope.$on('$routeChangeSuccess', function (event,next,current) {
		$rootScope.loaded = true;
		if(next && next.$$route){
			var redirectionFunction = next.$$route.redirection;
			if(redirectionFunction){
				var route = $injector.invoke(redirectionFunction);
				if(route){
					$location.path(route);
				}
			}
		}
	});

	$rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
		var aToast = ngToast.create({
			className: 'success',
			content: 'Bonjour , <strong>'+ $rootScope.currentUser.login +'</strong> !'
		});
	});
	$rootScope.$on(AUTH_EVENTS.loginFailed, function () {
		var aToast = ngToast.create({
			className: 'danger',
			content: 'Erreur de connexion, merci de vérifier vos identifiants !'
		});
	});
	$rootScope.$on(AUTH_EVENTS.logoutSuccess, function () {
		var aToast = ngToast.create({
			className: 'danger',
			content: 'You are logged out !'
		});
	});

	// Article Post
	$rootScope.$on(ARTICLE_EVENTS.postSuccess, function () {
		var aToast = ngToast.create({
			className: 'success',
			content: 'L\'article vient d\'être posté !'
		});
	});
	$rootScope.$on(ARTICLE_EVENTS.postFailed, function () {
		var aToast = ngToast.create({
			className: 'warning',
			content: 'Une erreur est survenue lors de la création de l\'article, merci de réessayer !'
		});
	});
	// Article Delete
	$rootScope.$on(ARTICLE_EVENTS.deleteSuccess, function () {
		var aToast = ngToast.create({
			className: 'success',
			content: 'L\'article a été supprimé !'
		});
	});
	$rootScope.$on(ARTICLE_EVENTS.deleteFailed, function () {
		var aToast = ngToast.create({
			className: 'warning',
			content: 'Une erreur est survenue lors de la suppression de l\'article, réessayez !'
		});
	});
	
	// Com Post
	$rootScope.$on(POSTS_EVENTS.postSuccess, function () {
		var aToast = ngToast.create({
			className: 'success',
			content: 'Votre commentaire vient d\'être posté !'
		});
	});
	$rootScope.$on(POSTS_EVENTS.postFailed, function () {
		var aToast = ngToast.create({
			className: 'warning',
			content: 'Une erreur est survenue lors de la création de votre commentaire, merci de réessayer !'
		});
	});
	// Com Delete
	$rootScope.$on(POSTS_EVENTS.deleteSuccess, function () {
		var aToast = ngToast.create({
			className: 'success',
			content: 'Le commentaire a bien été supprimé !'
		});
	});
	$rootScope.$on(POSTS_EVENTS.deleteFailed, function () {
		var aToast = ngToast.create({
			className: 'warning',
			content: 'Une erreur est survenue lors de la suppression du commentaire, merci de réessayer !'
		});
	});

	// Mail
	$rootScope.$on(MAIL_EVENTS.sendSuccess, function () {
		var aToast = ngToast.create({
			className: 'success',
			content: 'Votre email vient d\'être envoyé !'
		});
	});
	$rootScope.$on(MAIL_EVENTS.sendFailed, function () {
		var aToast = ngToast.create({
			className: 'warning',
			content: 'Une erreur est survenue lors de l\'envoie de l\'email, merci de réessayer !'
		});
	});

	// Newsletter
	$rootScope.$on(NEWSLETTER_EVENTS.addSuccess, function () {
		var aToast = ngToast.create({
			className: 'success',
			content: 'Vous avez souscrit à la newsletter, merci !'
		});
	});
	$rootScope.$on(NEWSLETTER_EVENTS.addFailed, function () {
		var aToast = ngToast.create({
			className: 'warning',
			content: 'Une erreur est survenue lors de votre ajout à la newsletter, merci de réessayer !'
		});
	});
	$rootScope.$on(NEWSLETTER_EVENTS.deleteSuccess, function () {
		var aToast = ngToast.create({
			className: 'success',
			content: 'Vous avez bien été rétiré de notre newsletter !'
		});
	});
	$rootScope.$on(NEWSLETTER_EVENTS.deleteFailed, function () {
		var aToast = ngToast.create({
			className: 'warning',
			content: 'Une erreur est survenue lors de votre retrait de la newsletter, merci de réessayer !'
		});
	});
	$rootScope.$on(NEWSLETTER_EVENTS.sendSuccess, function () {
		var aToast = ngToast.create({
			className: 'success',
			content: 'Un email a été envoyé à toutes les personnes ayant souscrit à votre newsletter !'
		});
	});
	$rootScope.$on(NEWSLETTER_EVENTS.sendFailed, function () {
		var aToast = ngToast.create({
			className: 'warning',
			content: 'L\'envoi de l\'email censé avertir les abonnés à la newsletter à échoué, merci de réessayer !'
		});
	});
	$rootScope.$on(NEWSLETTER_EVENTS.noSubscribers, function () {
		var aToast = ngToast.create({
			className: 'warning',
			content: 'Aucune personne n\'a souscrit à la newsletter !'
		});
	});
	$rootScope.$on(NEWSLETTER_EVENTS.alreadyRegistred, function () {
		var aToast = ngToast.create({
			className: 'warning',
			content: 'Vous avez déjà souscrit à cette newsletter, merci !'
		});
	});	

}]);

arevia.config(['ngToastProvider', function(ngToast) {
	ngToast.configure({
		verticalPosition: 'top',
		horizontalPosition: 'center',
		maxNumber: 2,
		animation: 'slide',
		dismissOnClick: true,
		dismissOnTimeout: true,
		timeout: 3500,
	});
}]);

arevia.constant('AUTH_EVENTS', {
	loginSuccess: 'auth-login-success',
	loginFailed: 'auth-login-failed',
	logoutSuccess: 'auth-logout-success',
	sessionTimeout: 'auth-session-timeout'
}).constant('ARTICLE_EVENTS', {
	postSuccess: 'post-article-success',
	postFailed: 'post-article-failed',
	deleteSuccess: 'delete-article-success',
	deleteFailed: 'delete-article-failed',
	selectSuccess: 'select-article-success',
	selectFailed: 'select-article-failed',
	deleteConfirmation: 'delete-post-confirmation'
}).constant('FILE_EVENTS', {
	uploadSuccess: 'upload-file-success',
	uploadFailed: 'upload-file-failed',
	deleteSuccess: 'delete-file-success',
	deleteFailed: 'delete-file-failed'
}).constant('POSTS_EVENTS', {
	postSuccess: 'post-com-success',
	postFailed: 'post-com-failed',
	deleteSuccess: 'delete-com-success',
	deleteFailed: 'delete-com-failed'
}).constant('MAIL_EVENTS', {
	sendSuccess: 'send-mail-success',
	sendFailed: 'send-mail-failed'
}).constant('NEWSLETTER_EVENTS', {
	addSuccess: 'addTo-newsletter-success',
	addFailed: 'addTo-newsletter-failed',
	sendSuccess: 'send-newsletter-success',
	sendFailed: 'send-newsletter-failed',
	deleteSuccess: 'deleteTo-newsletter-success',
	deleteFailed: 'deleteTo-newsletter-failed',
	alreadyRegistred: 'alreadyRegistred-newsletter',
	noSubscribers: 'noSubscribers-newsletter'
});