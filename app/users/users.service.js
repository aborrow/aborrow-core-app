angular.module('angularfireSlackApp')
    .factory('Users', function($firebaseArray, $firebaseObject, FirebaseUrl) {
        var usersRef = new Firebase(FirebaseUrl + 'users');
        // var connectedRef = new Firebase(FirebaseUrl+'.info/connected');
        var users = $firebaseArray(usersRef);
        var Users = {
            getProfile: function(uid) {
                return $firebaseObject(usersRef.child(uid));
            },
            getDisplayName: function(uid) {
                return users.$getRecord(uid).displayName;
            },
            getGravatar: function(uid) {
                return '//www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash;
            },

            saveUser: function(user) {
                usersRef.child(user.uid).set({
                    'email': user.email
                });
            },

            saveApp: function(uid, app, section) {
                usersRef.child(uid).child('current_app').child(section).set(app);
            },

            loadCurrentApp: function(uid) {
                return $firebaseObject(usersRef.child(uid).child('current_app'));
            },

            getCurrentAppSection: function(uid, section) {
                return $firebaseObject(usersRef.child(uid).child('current_app').child(section));
            },

            getCurrentAppState: function(uid) {
                return $firebaseObject(usersRef.child(uid).child('current_app').child('state'));
            },

            // setOnline: function(uid){
            //   var connected = $firebaseObject(connectedRef);
            //   var online = $firebaseArray(usersRef.child(uid+'/online'));

            //   connected.$watch(function (){
            //     if(connected.$value === true){
            //       online.$add(true).then(function(connectedRef){
            //         connectedRef.onDisconnect().remove();
            //       });
            //     }
            //   });
            // },
            all: users
        };
        return Users;
    });