module.controller('jsonInput', function($scope, $http, $routeParams, $timeout, $location, EmailService) {
	$scope.currentEmail = $routeParams.currentEmail;
	EmailService.setEmail($scope.currentEmail);
	$scope.emailName = EmailService.getEmail();
	$scope.inputJSON = EmailService.getInputJSON();
	$scope.errInvalidJSON = false;
	$scope.errBlankName = false;

	$scope.getJSON = function() {
		EmailService.getEmailData($scope.currentEmail).then(function(res){
			$scope.inputJSON = EmailService.getInputJSON();
		});
	};
	$scope.getJSON();

	var verifyJSON = function(){
		try {
			JSON.parse($scope.inputJSON);
		} catch (e) {
			return false;
		}
		return true;
	}

	var verifyBlankEmail = function(){
		return (($scope.emailName!="") && ($scope.emailName.toLowerCase()!="new"));
	}

	var checkError = function(errCheckFunction, errVar, pHideAfter){
		var hideAfter =  pHideAfter || 0;
		if (!errCheckFunction()){
			$scope[errVar] = true;
			if (pHideAfter>0){
				$timeout(function(){
					$scope[errVar]= false;
				},hideAfter);
			}
		} else {
			$scope[errVar] = false;
		}
		return $scope[errVar];
	}

	$scope.updateJSON = function(){
		var e1 = checkError(verifyJSON, "errInvalidJSON", 2000);
		var e2 = checkError(verifyBlankEmail, "errBlankName", 2000);
		if (e1 || e2)
			return;

		if ($scope.emailName!="") {
			EmailService.setEmail($scope.emailName);
		}
		EmailService.setInputJSON($scope.inputJSON);
		if (EmailService.parseJSON()){
			EmailService.saveEmail();
		}
		$location.path("/item");
        $scope.readEmailList();
	}

	$scope.removeJSON = function(){
        if (!confirm("Do you really want to remove json "+$scope.emailName+"?")){
            return;
        }
		EmailService.removeJSON();
        $scope.emailName = "";
        $scope.inputJSON = "";
        $scope.readEmailList();
		$location.path("/");
	}

	
});