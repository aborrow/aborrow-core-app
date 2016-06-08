angular.module('angularfireSlackApp')
.controller('BorrowerCtrl', function($scope, $filter, $http, Users, profile, state, Banks) {
        var borrowerCtrl = this;
        borrowerCtrl.users = Users;
        borrowerCtrl.profile = profile;
        // borrowerCtrl.apps = borrowerCtrl.users.loadCurrentApp(borrowerCtrl.profile.$id);
        borrowerCtrl.currentApp = borrowerCtrl.users.loadCurrentApp(borrowerCtrl.profile.$id);
        borrowerCtrl.banks = Banks;
        console.log(borrowerCtrl.banks);

        console.log(borrowerCtrl.profile, borrowerCtrl.currentApp);

        //TODO:
        //get current app and bind data
        //save app steps

        $scope.tabs = [{
            title: 'รายละเอียดสินเชื่อ',
            page: 'borrowers/template/member-application/app-step1.html'
        }, {
            title: 'ข้อมูลส่วนตัว',
            page: 'borrowers/template/member-application/app-step2.html'
        }, {
            title: 'ประวัติการทำงาน',
            page: 'borrowers/template/member-application/app-step3.html'
        }, {
            title: 'หนี้สิน',
            page: 'borrowers/template/member-application/app-step4.html'
        }, {
            title: 'เอกสาร',
            page: 'borrowers/template/member-application/app-step5.html'
        }, {
            title: 'ข้อมูลติดต่อ',
            page: 'borrowers/template/member-application/app-step6.html'
        }, {
            title: 'การเปิดเผยข้อมูล',
            page: 'borrowers/template/member-application/app-step7.html'
        }];

        var current_detail = borrowerCtrl.users.getCurrentAppSection(borrowerCtrl.profile.$id, 'loan_detail');
        $scope.loanDetail = current_detail ? current_detail : {};

        var current_personal_data = borrowerCtrl.users.getCurrentAppSection(borrowerCtrl.profile.$id, 'personal_data');
        $scope.personalDetail = current_personal_data ? current_personal_data : {};

        var current_work_history = borrowerCtrl.users.getCurrentAppSection(borrowerCtrl.profile.$id, 'work_history');
        $scope.workHistory = current_work_history ? current_work_history : {};

        var current_debt_data = borrowerCtrl.users.getCurrentAppSection(borrowerCtrl.profile.$id, 'debt_data');
        $scope.debt = current_debt_data ? current_debt_data : {};

        var current_documents = borrowerCtrl.users.getCurrentAppSection(borrowerCtrl.profile.$id, 'documents');
        $scope.documents = current_documents ? current_documents : {};

        var current_contacts = borrowerCtrl.users.getCurrentAppSection(borrowerCtrl.profile.$id, 'contacts');
        $scope.contacts = current_contacts ? current_contacts : {};

        $scope.term_data = {};

        $scope.state = state ? state : 1;

        $scope.isAcceptTerm = false;

        $scope.selectedTab = $scope.state ? $scope.state - 1 : 0;
        $scope.templateURL = $scope.tabs[$scope.selectedTab].page; //'borrowers/template/member-application/app-step1.html';

        $scope.openTab = function(tabIndex) {
            console.log(tabIndex, $scope.state, $scope.selectedTab);
            if (tabIndex <= $scope.state) {
                if ($scope.selectedTab == 0) {
                    saveLoanData();
                } else if ($scope.selectedTab == 1) {
                    savePersonalData();
                } else if ($scope.selectedTab == 2) {
                    saveWorkHistoryData();
                } else if ($scope.selectedTab == 3) {
                    saveDebtData();
                } else if ($scope.selectedTab == 4) {
                    saveDocumentData();
                } else if ($scope.selectedTab == 5) {
                    saveContact();
                }
                $scope.selectedTab = tabIndex;
                $scope.templateURL = $scope.tabs[tabIndex].page;
            }
            console.log($scope.templateURL);
        };

        function nextTab() {
            console.log($scope.selectedTab);
            var nextTabIndex = $scope.selectedTab + 1;
            $scope.selectedTab = nextTabIndex;
            if (($scope.selectedTab + 1) > $scope.state) {
                $scope.state = $scope.selectedTab + 1;
            }
            console.log(nextTabIndex);
            $scope.templateURL = $scope.tabs[nextTabIndex].page;
        };

        $scope.previousTab = function() {
            var previousTabIndex = $scope.selectedTab - 1;
            if ($scope.selectedTab == 1) {
                savePersonalData();
            } else if ($scope.selectedTab == 2) {
                saveWorkHistoryData();
            } else if ($scope.selectedTab == 3) {
                saveDebtData();
            } else if ($scope.selectedTab == 4) {
                saveDocumentData();
            } else if ($scope.selectedTab == 5) {
                saveContact();
            }
            if (previousTabIndex > -1) {
                $scope.selectedTab = previousTabIndex;
                $scope.templateURL = $scope.tabs[previousTabIndex].page;
            }
        };

        $scope.submitData = function() {
            //validate and save data
            if ($scope.selectedTab == 0) {
                saveLoanData();
            } else if ($scope.selectedTab == 1) {
                savePersonalData();
            } else if ($scope.selectedTab == 2) {
                saveWorkHistoryData();
            } else if ($scope.selectedTab == 3) {
                saveDebtData();
            } else if ($scope.selectedTab == 4) {
                saveDocumentData();
            } else if ($scope.selectedTab == 5) {
                saveContact();
            }
            nextTab();
        };

        $scope.saveTermData = function() {
            //validate and save data
            // console.log(borrowerCtrl.selected_banks);
            if ($scope.isAcceptTerm === true) {
                $scope.term_data.saved_at = Date.now();
                $scope.term_data.saved_at_display = "บันทึกแล้วเมื่อวันที่ " +
                    moment($scope.contacts.saved_at).format("D/M/YYYY") +
                    " เวลา " + moment($scope.contacts.saved_at).format("HH.mm") + " น."
                    // console.log(borrowerCtrl.profile.$id, $scope.contacts);
                    // borrowerCtrl.users.saveApp(borrowerCtrl.profile.$id, $scope.contacts, 'contacts');
                borrowerCtrl.currentApp.state = $scope.state;
                $scope.term_data.selected_banks = borrowerCtrl.selected_banks;
                borrowerCtrl.currentApp.term_data = $scope.term_data;
                borrowerCtrl.currentApp.$save();
            }
        }
        $scope.acceptTerm = function() {
            $scope.isAcceptTerm = !$scope.isAcceptTerm;
        }

        //// private for save ////
        function saveLoanData() {
            var type = "PL";
            if ($scope.loanDetail.loanType === "สินเชื่อเงินสด")
                type = "PL";
            else
                type = "CC";
            $scope.appId = moment().format("YYYYMMDD") + "01" + "TH" + type;
            $scope.loanDetail.saved_at = Date.now();
            $scope.loanDetail.saved_at_display = "บันทึกแล้วเมื่อวันที่ " +
                moment($scope.loanDetail.saved_at).format("D/M/YYYY") +
                " เวลา " + moment($scope.loanDetail.saved_at).format("HH.mm") + " น."
            console.log(borrowerCtrl.profile.$id, $scope.loanDetail);
            borrowerCtrl.currentApp.state = $scope.state;
            borrowerCtrl.currentApp.appId = $scope.appId;
            // $scope.loanDetail.$save();
            // borrowerCtrl.users.saveApp(borrowerCtrl.profile.$id, $scope.loanDetail, 'loan_detail');
            borrowerCtrl.currentApp.loan_detail = $scope.loanDetail;
            borrowerCtrl.currentApp.$save();
        }

        function savePersonalData() {
            $scope.personalDetail.saved_at = Date.now();
            $scope.personalDetail.saved_at_display = "บันทึกแล้วเมื่อวันที่ " +
                moment($scope.personalDetail.saved_at).format("D/M/YYYY") +
                " เวลา " + moment($scope.personalDetail.saved_at).format("HH.mm") + " น."
            console.log(borrowerCtrl.profile.$id, $scope.personalDetail);
            // borrowerCtrl.users.saveApp(borrowerCtrl.profile.$id, $scope.personalDetail, 'personal_data');
            borrowerCtrl.currentApp.state = $scope.state;
            borrowerCtrl.currentApp.personal_data = $scope.personalDetail;
            borrowerCtrl.currentApp.$save();
        }

        function saveWorkHistoryData() {
            $scope.workHistory.saved_at = Date.now();
            $scope.workHistory.saved_at_display = "บันทึกแล้วเมื่อวันที่ " +
                moment($scope.workHistory.saved_at).format("D/M/YYYY") +
                " เวลา " + moment($scope.workHistory.saved_at).format("HH.mm") + " น."
            console.log(borrowerCtrl.profile.$id, $scope.workHistory);
            // borrowerCtrl.users.saveApp(borrowerCtrl.profile.$id, $scope.workHistory, 'work_history');
            borrowerCtrl.currentApp.state = $scope.state;
            borrowerCtrl.currentApp.work_history = $scope.workHistory;
            borrowerCtrl.currentApp.$save();
        }

        function saveDebtData() {
            $scope.debt.saved_at = Date.now();
            $scope.debt.saved_at_display = "บันทึกแล้วเมื่อวันที่ " +
                moment($scope.debt.saved_at).format("D/M/YYYY") +
                " เวลา " + moment($scope.debt.saved_at).format("HH.mm") + " น."
            console.log(borrowerCtrl.profile.$id, $scope.debt);
            // borrowerCtrl.users.saveApp(borrowerCtrl.profile.$id, $scope.debt, 'debt_data');
            borrowerCtrl.currentApp.state = $scope.state;
            borrowerCtrl.currentApp.debt_data = $scope.debt;
            borrowerCtrl.currentApp.$save();
            nextTab();
        }

        function saveDocumentData() {
            //validate and save data
            $scope.documents.saved_at = Date.now();
            $scope.documents.saved_at_display = "บันทึกแล้วเมื่อวันที่ " +
                moment($scope.documents.saved_at).format("D/M/YYYY") +
                " เวลา " + moment($scope.documents.saved_at).format("HH.mm") + " น."
            console.log(borrowerCtrl.profile.$id, $scope.documents);
            // borrowerCtrl.users.saveApp(borrowerCtrl.profile.$id, $scope.documents, 'documents');
            borrowerCtrl.currentApp.state = $scope.state;
            borrowerCtrl.currentApp.documents = $scope.documents;
            borrowerCtrl.currentApp.$save();
        }

        function saveContact() {
            $scope.contacts.saved_at = Date.now();
            $scope.contacts.saved_at_display = "บันทึกแล้วเมื่อวันที่ " +
                moment($scope.contacts.saved_at).format("D/M/YYYY") +
                " เวลา " + moment($scope.contacts.saved_at).format("HH.mm") + " น."
            console.log(borrowerCtrl.profile.$id, $scope.contacts);
            // borrowerCtrl.users.saveApp(borrowerCtrl.profile.$id, $scope.contacts, 'contacts');
            borrowerCtrl.currentApp.state = $scope.state;
            borrowerCtrl.currentApp.contacts = $scope.contacts;
            borrowerCtrl.currentApp.$save();
        }



        // borrowerCtrl.logout = function() {
        //   Auth.ref.unauth();
        // }

        ////OFFERS//////

        /////END OFFERS////

        ////uploads
        $scope.creds = {
        }

        $scope.upload = function() {
            // Configure The S3 Object
            AWS.config.update({
                accessKeyId: $scope.creds.access_key,
                secretAccessKey: $scope.creds.secret_key
            });
            AWS.config.region = 'ap-southeast-1';
            var bucket = new AWS.S3({
                params: {
                    Bucket: $scope.creds.bucket
                }
            });
            console.log(borrowerCtrl.file);
            if ($scope.file) {
                var params = {
                    Key: $scope.file.name,
                    ContentType: $scope.file.type,
                    Body: $scope.file,
                    ServerSideEncryption: 'AES256'
                };

                bucket.putObject(params, function(err, data) {
                        if (err) {
                            // There Was An Error With Your S3 Config
                            alert(err.message);
                            return false;
                        } else {
                            // Success!
                            alert('Upload Done');
                        }
                    })
                    .on('httpUploadProgress', function(progress) {
                        // Log Progress Information
                        console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
                    });
            } else {
                // No File Selected
                alert('No File Selected');
            }
        }
});
