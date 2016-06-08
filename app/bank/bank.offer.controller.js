angular.module('angularfireSlackApp')
    .controller('bankOfferController', function($scope, $filter, $http, $stateParams, profile,Users,Banks) {
        $scope.profile = profile;

        $scope.uid = $stateParams.uid;
        $scope.offer = {}
        $scope.documents = [{text: "สำเนาบัตรประชาชน",checked: false}, { text: "สำเนาหน้าสมุดบัญชีธนาคาร",checked: false}, 
        { text: "Bank Statement 6 เดือนล่าสุด",checked: false}, { text: "สลิปเงินเดือน (สำเนา)", checked: false }, 
        { text: "สลิปเงินเดือน (ตัวจริง)",checked: false}, { text: "หนังสือรับรองเงินเดือน (สำเนา)",checked: false }, 
        { text: "หนังสือรับรองเงินเดือน (ตัวจริง)",checked: false}, { text: "สำเนาหนังสือรับรองบริษัท", checked: false }, 
        { text: "สำเนารายชื่อผู้ถือหุ้น",checked: false }, { text: "สำเนาใบทะเบืยนการค่า", checked: false }, 
        { text: "อื่นๆ",remark:"",checked: false}]


        $scope.sendOffer = function () {
            var offer = {};
            offer.bankId = "SCB";
            offer.appId = profile.appId;
            offer.offered_at = Date.now();
            offer.offer = $scope.offer;          
            offer.offer.documents =  _.filter($scope.documents,{checked:true})
                                        .reduce(function(result,value){                                          
                                            if(value.text === 'อื่นๆ'){
                                                result.push(value.remark);
                                            }else{
                                                result.push(value.text);
                                            }
                                            return result;
                                        },[]);
            let bank = Banks[6];
            bank.offers = [offer];                         
            profile.offers = [offer];
            Banks.$save(bank);
            profile.$save();
            console.log(offer);
            alert("sending an offer...");
        };
    });