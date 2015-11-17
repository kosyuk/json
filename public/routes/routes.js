var module = angular.module('myapp', ['dndLists', 'ngRoute', 'ngResource']);

module.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/email/:currentEmail', {
				templateUrl: 'routes/jsonInput/jsonInput.html',
				controller: 'jsonInput'
			})
			.when('/item', {
				templateUrl: 'routes/jsonItem/jsonItem.html',
				controller: 'jsonItem'
			})
			.when('/jsonOutput', {
				templateUrl: 'routes/output/jsonOutput.html',
				controller: 'dataOutput'
			})
			.when('/xlsOutput', {
				templateUrl: 'routes/output/xlsOutput.html',
				controller: 'dataOutput'
			})
			.when('/mapOutput', {
				templateUrl: 'routes/output/mapOutput.html',
				controller: 'dataOutput'
			})
			.otherwise({
				redirectTo: '/'
			});
			
	}
]);
