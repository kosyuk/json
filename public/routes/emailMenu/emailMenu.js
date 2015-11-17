module.controller('EmailMenu', function($scope, $http) {

	$scope.readEmailList = function(){
		$http.get("/email")
		.success(function(emails){
			$scope.emails = emails;
		});
	};

	$scope.readEmailList();
	
});
