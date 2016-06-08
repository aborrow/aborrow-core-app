angular.module('angularfireSlackApp')
    .controller('bankProfileController', function($scope, $filter, $http, $stateParams, profile) {
        $scope.profile = profile;

        $scope.tabs = [{
            title: 'รายละเอียดสินเชื่อ',
            page: 'bank/templates/member-application/app-step1.html'
        }, {
            title: 'ข้อมูลส่วนตัว',
            page: 'bank/templates/member-application/app-step2.html'
        }, {
            title: 'ประวัติการทำงาน',
            page: 'bank/templates/member-application/app-step3.html'
        }, {
            title: 'หนี้สิน',
            page: 'bank/templates/member-application/app-step4.html'
        }, {
            title: 'เอกสาร',
            page: 'bank/templates/member-application/app-step5.html'
        }, {
            title: 'ข้อมูลติดต่อ',
            page: 'bank/templates/member-application/app-step6.html'
        }];

        $scope.selectedTab = $scope.state ? $scope.state - 1 : 0;
        $scope.templateURL = $scope.tabs[$scope.selectedTab].page;
        $scope.uid = $stateParams.uid;
        $scope.openTab = function(tabIndex) {
            $scope.selectedTab = tabIndex;
            $scope.templateURL = $scope.tabs[tabIndex].page;
        };
    });