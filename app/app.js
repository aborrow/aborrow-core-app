'use strict';

/**
 * @ngdoc overview
 * @name angularfireSlackApp
 * @description
 * # angularfireSlackApp
 *
 * Main module of the application.
 */
angular
    .module('angularfireSlackApp', [
        'firebase',
        'angular-md5',
        'ui.router',
        'dynamicNumber',
        'tabs',
        'sticky',
        'ui.checkbox',
        'ngOrderObjectBy',
        'sbDateSelect',
        'rorymadden.date-dropdowns',
        'ui.mask'
        // 'angular.aws.s3',
        // 'angular-s3-upload'

    ])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/home.html',
                resolve: {
                    requireNoAuth: function($state, Auth) {
                        return Auth.$requireAuth().then(function(auth) {
                            console.log(auth);
                            // $state.go('borrower');
                            var ref = new Firebase("https://aborrow-test.firebaseio.com");
                            ref.unauth();
                        }, function(error) {
                            console.log(error);
                            return;
                        });
                    }
                }
            })
            .state('login', {
                url: '/login',
                controller: 'AuthCtrl as authCtrl',
                templateUrl: 'auth/login.html',
                resolve: {
                    requireNoAuth: function($state, Auth) {
                        return Auth.$requireAuth().then(function(auth) {
                            $state.go('borrower');
                        }, function(error) {
                            return;
                        });
                    }
                }
            })
            .state('register', {
                url: '/register',
                controller: 'AuthCtrl as authCtrl',
                templateUrl: 'auth/register.html',
                resolve: {
                    requireNoAuth: function($state, Auth) {

                        return Auth.$requireAuth().then(function(auth) {
                            console.log(auth);
                            $state.go('borrower');
                        }, function(error) {
                            return;
                        });
                    }
                }
            })
            .state('profile', {
                url: '/profile',
                controller: 'ProfileCtrl as profileCtrl',
                templateUrl: 'users/profile.html',
                resolve: {
                    profile: function(Users, Auth) {
                        return Auth.$requireAuth().then(function(auth) {
                            // console.log('profile');
                            return Users.getProfile(auth.uid).$loaded();
                        });
                    },
                    auth: function($state, Users, Auth) {
                        return Auth.$requireAuth().catch(function() {
                            // console.log('login');
                            $state.go('login');
                        });
                    }
                }
            })

        .state('borrower', {
            url: '/borrower',
            controller: 'BorrowerCtrl as borrowerCtrl',
            templateUrl: 'borrowers/member-app.html',
            resolve: {
                profile: function(Users, Auth) {
                    return Auth.$requireAuth().then(function(auth) {
                        // console.log('profile');
                        return Users.getProfile(auth.uid).$loaded();
                    });
                },
                auth: function($state, Users, Auth) {
                    return Auth.$requireAuth().catch(function() {
                        console.log('login');
                        $state.go('login');
                    });
                },
                state: function(Users, Auth) {
                    return Auth.$requireAuth().then(function(auth) {
                        return Users.getCurrentAppState(auth.uid).$loaded().then(function(res) {
                            return res.$value;
                        });
                    });
                }
            }
        })

        .state('offers', {
                url: '/offers',
                controller: 'OffersController',
                templateUrl: 'borrowers/member-offers.html',
                resolve: {
                    profile: function(Users, Auth) {
                        return Auth.$requireAuth().then(function(auth) {
                            // console.log('profile');
                            return Users.getProfile(auth.uid).$loaded();
                        });
                    }
                }
            })
            .state('bank', {
                url: '/bank',
                controller: 'bankController',
                templateUrl: 'bank/dashboard.html',
                resolve: {
                    userList: function(Users) {
                        return Users.all.$loaded()
                    }

                }
            })
            .state('bankUserProfile', {
                url: '/bank/user/profile/:uid',
                controller: 'bankProfileController',
                templateUrl: 'bank/userprofile.html',
                resolve: {
                    profile: function(Users, $stateParams) {
                        return Users.loadCurrentApp($stateParams.uid).$loaded();
                    }

                }
            }).state('bankUserOffer', {
                url: '/bank/user/profile/:uid/offer',
                controller: 'bankOfferController',
                templateUrl: 'bank/offer.html',
                resolve: {
                    profile: function(Users, $stateParams) {
                        return Users.loadCurrentApp($stateParams.uid).$loaded();
                    }

                }
            })
        $urlRouterProvider.otherwise('/');
    })
    .constant('FirebaseUrl', 'https://aborrow-test.firebaseio.com/');