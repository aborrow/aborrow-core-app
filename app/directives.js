angular.module('angularfireSlackApp')
.directive('file', function() {
  return {
    restrict: 'AE',
    scope: {
      file: '@',
      fileId: '='
    },
    // controller: 'BorrowerCtrl as borrowerCtrl',
    controller: ['$scope', function($scope) {
      $scope.creds = {
        bucket: '',
        access_key: '',
        secret_key: ''
      }

      $scope.upload = function() {
        // Configure The S3 Object
        AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
        AWS.config.region = 'ap-southeast-1';
        var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });

        if($scope.file) {
          var params = { Key: $scope.file.name, ContentType: $scope.file.type, Body: $scope.file, ServerSideEncryption: 'AES256' };

          bucket.putObject(params, function(err, data) {
            if(err) {
              // There Was An Error With Your S3 Config
              alert(err.message);
              return false;
            }
            else {
              // Success!
              alert('Upload Done');
              console.log($scope.file);
              $scope.fileId = "https://s3-ap-southeast-1.amazonaws.com/aborrow/" + $scope.file.name;
              $scope.$apply();
            }
          })
          .on('httpUploadProgress',function(progress) {
                // Log Progress Information
                // console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
                $scope.uploadProgress = Math.round(progress.loaded / progress.total * 100);
                $scope.$digest();
              });
        }
        else {
          // No File Selected
          alert('No File Selected');
        }
      }

    }],
    template: '<div style="padding-bottom:20px;"><div class="col-lg-6"><input name="file" type="file" style="font-size:20px;" class="input-info"></div><div class="col-lg-2"><a class="btn btn-primary btn-xs" ng-click="upload()">Upload</a></div><div class="col-lg-4"><div class="progress-bar" role="progressbar" aria-valuenow="{{ uploadProgress }}" aria-valuemin="0" aria-valuemax="100" style="width: {{ uploadProgress }}%;">{{ uploadProgress == 0 ? "" : uploadProgress + "%" }}</div></div></div>' ,

    // <div class="progress" style="width:30%;"><div class="progress-bar" role="progressbar" aria-valuenow="{{ uploadProgress }}" aria-valuemin="0" aria-valuemax="100" style="width: {{ uploadProgress }}%;">{{ uploadProgress == 0 ? "" : uploadProgress + "%" }}</div></div>
    // require: '?ngModel',
    link: function(scope, el, attrs, ngModel){
      el.bind('change', function(event){
        scope.uploadProgress = 0;
        var files = event.target.files;
        var file = files[0];
        scope.file = file;
        scope.$parent.file = file;
        console.log(scope.$parent.borrowerCtrl)
        console.log(scope.file);
        // scope.upload();
        // console.log(ngModel);
        // ngModel.$viewValue = file;
        scope.$apply();

      });
    }
  };
});
