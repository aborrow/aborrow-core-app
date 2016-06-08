angular.module('angularfireSlackApp')
    .controller('bankController', function($scope, $filter, $http, userList) {
        $scope.filter = {};
        $scope.filter.loanTypes = [{
            text: "สินเชื่อเงินสด",
            checked: true
        }, {
            text: "บัตรกดเงินสด",
            checked: true
        }];
        $scope.filter.occupations = [{
            text: "พนักงานบริษัทมหาชน",
            checked: true
        }, {
            text: "พนักงานบริษัทขนาดใหญ่",
            checked: true
        }, {
            text: "พนักงานบริษัทขนาดเล็ก",
            checked: true
        }, {
            text: "ข้าราชการ / รัฐวิสาหกิจ",
            checked: true
        }, {
            text: "เจ้าของกิจการ",
            checked: true
        }, {
            text: "อาชีพอิสระ",
            checked: true
        }, {
            text: "พนักงานรับจ้างรายวัน",
            checked: true
        }, {
            text: "ผู้มารายได้หลักจากคอมมิชชั่น",
            checked: true
        }, ]

        $scope.users = userList;
        $scope.filterUserList = function() {
            let loantype = _.filter($scope.filter.loanTypes, {
                checked: true
            });
            let occupation = _.filter($scope.filter.occupations, {
                checked: true
            });

            let u = _.filter(userList, function(user) {
                let filter = user.current_app.state >= 5;
                filter = filter && (_.some(loantype, ['text', user.current_app.loan_detail.loanType]));
                filter = filter && (_.some(occupation, ['text', user.current_app.work_history.career]));

                if ($scope.filter.loanMinAmount >= 0) {
                    filter = filter && user.current_app.loan_detail.loanAmount >= $scope.filter.loanMinAmount;
                }
                if ($scope.filter.loanMaxAmount >= 0 && $scope.filter.loanMaxAmount !== "") {
                    filter = filter && user.current_app.loan_detail.loanAmount <= $scope.filter.loanMaxAmount;
                }
                if ($scope.filter.income >= 0 && $scope.filter.income !== "") {
                    filter = filter && user.current_app.work_history.baseIncome >= $scope.filter.income;
                }
                if ($scope.filter.delinquency >= 0 && $scope.filter.delinquency !== "") {
                    filter = filter && user.current_app.debt_data.delinquency <= $scope.filter.delinquency;
                }
                if ($scope.filter.latepayment >= 0 && $scope.filter.latepayment !== "") {
                    filter = filter && user.current_app.debt_data.latepayment <= $scope.filter.latepayment;
                }

                return filter;
            })
            angular.forEach(u, function(value, key) {
                value.date = moment(value.current_app.loan_detail.saved_at).format("D-MMM-YYYY");
            });
            u = _.orderBy(u, ['date'], ['desc']);
            return u;

        };
    });