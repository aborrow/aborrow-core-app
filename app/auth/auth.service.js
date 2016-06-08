angular.module('angularfireSlackApp')
	.factory('Auth', function($firebaseAuth, FirebaseUrl) {
		var ref = new Firebase(FirebaseUrl);
		var auth = $firebaseAuth(ref);

  //   var Auth = {
  //     ref: ref,
  //     auth: auth
  //   };
		// return Auth;
    return auth;
	});
