angular.module('angularfireSlackApp')
    .factory('Banks', function($firebaseArray, $firebaseObject, FirebaseUrl) {
        var banksRef = new Firebase(FirebaseUrl + '/banks');
        // var connectedRef = new Firebase(FirebaseUrl+'.info/connected');
        var banks = $firebaseArray(banksRef);
        var Banks = {
            getBankById: function(bank) {
                return $firebaseObject(banksRef.child(bank));
            },
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
            all: banks
        };
        return banks;
    });