module.controller('dataOutput', function($scope, EmailService) {
	$scope.outputJSON = formatOutputJSON(EmailService.getSelectedItems());
	$scope.outputMap = formatOutputMap(EmailService.getSelectedItems());
	$scope.selectedItems = EmailService.getSelectedItems();

	function formatOutputJSON(items){
		var output = [];
		for (var i=0,l=items.length; i<l; i++){
			output.push(JSON.stringify({"name":items[i].name,"value":items[i].value}));
		}
		return output.join(",");
	}

	function formatOutputMap(items){
		var output = [];
		for (var i=0,l=items.length; i<l; i++){
			output.push(JSON.stringify({"from":items[i].key, "to":items[i].name}));
		}
		return output.join(",");
	}

});