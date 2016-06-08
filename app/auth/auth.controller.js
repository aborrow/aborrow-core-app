angular.module('angularfireSlackApp')
	.controller('AuthCtrl', function(Auth, $state, Users) {
		var authCtrl = this;

		authCtrl.user = {
			email: '',
			password: ''
		};
		authCtrl.login = function() {
      console.log(authCtrl.user);
			Auth.$authWithPassword(authCtrl.user).then(function(auth) {
				$state.go('borrower');
			}, function(error) {
				authCtrl.error = error;
			});
		};
		authCtrl.register = function() {
			Auth.$createUser(authCtrl.user).then(function(user) {
        user.email = authCtrl.user.email;
        Users.saveUser(user);
				authCtrl.login();
			}, function(error) {
				authCtrl.error = error;
			});
		};

    authCtrl.logout = function() {
      Auth.ref.unauth();
    };
	});
