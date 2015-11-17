module.controller('jsonItem', function($scope, $http, $routeParams, $location, EmailService) {
	$scope.linedJSON = EmailService.getLinedJSON();
	$scope.selectedItemsIndex = EmailService.getSelectedItemsIndex();
	$scope.textRemove = EmailService.getTextRemove();
	$scope.capitalizeLetters = EmailService.getCapitalizeLetters();
	$scope.firstLowerCase = EmailService.getFirstLowerCase();

	$scope.isSelected = function(k){
		return $scope.selectedItemsIndex.hasOwnProperty(k);
	}
	$scope.updateSelection = function($event, key){
		var checkbox = $event.target;
		console.log("updateSelection");
		if (checkbox.checked){
			EmailService.selectItem(key);
		} else {
			EmailService.unSelectItem(key);
		}
	}
	$scope.$watch('textRemove', function(){
		$scope.linedJSON = EmailService.setTextRemove($scope.textRemove);
	})
	$scope.$watch('capitalizeLetters', function(){
		$scope.linedJSON = EmailService.setCapitalizeLetters($scope.capitalizeLetters);
	})
	$scope.$watch('firstLowerCase', function(){
		$scope.linedJSON = EmailService.setFirstLetterLowerCase($scope.firstLowerCase);
	})

});