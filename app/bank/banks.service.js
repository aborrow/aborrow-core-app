/*angular.module('angularfireSlackApp')
    .factory('Users', function($firebaseArray, $firebaseObject, FirebaseUrl) {
        var usersRef = new Firebase(FirebaseUrl + '/users');
        // var connectedRef = new Firebase(FirebaseUrl+'.info/connected');
        var Users = $firebaseArray(usersRef);
        var Users = {
            // saveApp: function(uid, app) {
            //   usersRef.child(uid).child('applications').push().set(app);
            // },
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
    });*/