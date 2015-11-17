 module.factory("EmailService", function($http, $q, $routeParams){
	var service = {};
	service.email = "";
	service.inputJSON = "";
	service.parsedJSON = "";
	service.linedJSON = "";
	service.selectedItems = []; // array from object,{key:, name:, value, order}
	service.textRemove = "";
	service.textRemoveItems = [];
	service.capitalizeLetters = false;
	service.firstLetterLowerCase = false;

	service.setEmail = function(email){
		service.email = email;
	}
	service.setInputJSON = function(inputJSON){
		service.inputJSON = inputJSON;
	}
	service.getEmail = function(){
		return service.email;
	}
	service.getInputJSON = function(){
		return service.inputJSON;
	}
	service.getSelectedItems = function(){
		return service.selectedItems;
	}
    service.getSelectedItemsIndex = function(){
		var output = {};
		for (var i=0,l=service.selectedItems.length; i<l; i++){
			output[service.selectedItems[i].key]=1;
		}
		return output;
	}
	service.getLinedJSON = function(){
		return service.linedJSON;
	}
	service.parseJSON = function(){
		try {
			service.parsedJSON = JSON.parse(service.inputJSON);
		} catch(e){
			return false;
		}
		service.linedJSON = [];
		walk(service.parsedJSON,"", 0);
		return service.parsedJSON;
	}
	service.saveEmail = function(emailJSON){
		var deferred = $q.defer();
		$http.post("/email", {
				emailName:service.email,
				inputJSON:service.inputJSON,
				selectedItems:service.selectedItems,
				textRemove:service.textRemove,
				capitalizeLetters:service.capitalizeLetters,
				firstLetterLowerCase:service.firstLetterLowerCase})
			.success(function(res){
				if (res){
					deferred.resolve("email saved");
				} else {
					deferred.reject("email unsaved!");
				}
			});
		return deferred.promise;
	}
	service.removeJSON = function(emailJSON){
	 var deferred = $q.defer();
		console.log(service.email);
	 $http.delete("/email/"+service.email).success(function(res){
			 if (res){
				 deferred.resolve("email removed");
			 } else {
				 deferred.reject("email unremoved!");
			 }
		 });
	 return deferred.promise;
	}
	service.selectItem = function(key){
		for (var i=0,c=service.linedJSON.length;i<c;i++){
			if (service.linedJSON[i].key==key){
				var replacedName = service.linedJSON[i].key;
				service.selectedItems.push({key:key, name:replacedName, value:service.linedJSON[i].val, order:service.selectedItems.length }) 
				break;
			}
		}
		service.saveEmail();
	}
	service.unSelectItem = function(key){
		for (var i=0,c=service.selectedItems.length;i<c;i++){
			if (service.selectedItems[i].key==key){
				service.selectedItems.splice(i, 1);
				break;
			}
		}
		service.saveEmail();
	}
	service.getEmailData = function(email){
		var deferred = $q.defer();
		$http.get("/email/"+email)
			.success(function(res){
				if (res){
					service.inputJSON = res.inputJSON || "";
					service.selectedItems = res.selectedItems || [];
					service.textRemove = res.textRemove  || [];
					service.capitalizeLetters = res.capitalizeLetters  || false;
					service.firstLetterLowerCase = res.firstLetterLowerCase || false;
					service.parseJSON();
					deferred.resolve();
				} else {
					deferred.reject("unable toget email!");
				}
			});
		return deferred.promise;
	}
 	service.setTextRemove = function(txt){
		service.textRemove = txt;
		service.saveEmail();
		service.textRemoveItems = [];
		if (txt==""){

		} else if (txt.indexOf(',')!==-1){
			service.textRemoveItems = txt.split(',').map(function(item){return item.trim(); });
		} else if (txt!==""){
			service.textRemoveItems.push(txt);
		}
		return updateNames();
	}
	service.getTextRemove = function() {
		 return service.textRemove;
	}
 	service.setCapitalizeLetters = function(capitalizeLetters){
		service.capitalizeLetters = capitalizeLetters;
		service.saveEmail();
		return updateNames();
 	}
	service.getCapitalizeLetters = function(capitalizeLetters){
		 return service.capitalizeLetters;
	}
 	service.setFirstLetterLowerCase = function(firstLetterLowerCase){
		service.firstLetterLowerCase = firstLetterLowerCase;
		service.saveEmail();
		return updateNames();
 	}
	 service.getFirstLowerCase = function(firstLetterLowerCase){
		 return service.firstLetterLowerCase;
	 }
 	var updateNames = function(){
		for (var i=0,c=service.linedJSON.length;i<c;i++){
			service.linedJSON[i].name = formatName(service.linedJSON[i].key, service.capitalizeLetters, service.firstLetterLowerCase, service.textRemoveItems);
		}
		for (var i=0,c=service.selectedItems.length;i<c;i++){
			service.selectedItems[i].name = formatName(service.selectedItems[i].key, service.capitalizeLetters, service.firstLetterLowerCase, service.textRemoveItems);
		}
		return service.linedJSON;
	}
 	function formatName(name,capitalize,lowercasefirst, removeArr){
		var n = name;

		if (capitalize){
			for (var i=1,c=n.length;i<c;i++) {
				if (n.charAt(i-1)==='.'){
					n = n.replaceAt(i, n.charAt(i).toUpperCase());
				}
			}
		}

		for (var i=0,c=removeArr.length;i<c;i++){
			var pattern = new RegExp(escapeRegExp(removeArr[i]), 'gi');
			n = n.replace(pattern,'');
		}
	 	if (lowercasefirst){
			n = n.replaceAt(0, n.charAt(0).toLowerCase());
		}

		return n;
	}
	function walk(obj , prefix, debth) {
		if (prefix!="") 
			prefix = prefix+".";
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				var val = obj[key];
				if (typeof val === 'object' && val.constructor === Array){
					service.linedJSON.push({key:prefix+key, val:"[]", debth:debth});
				} else if (typeof val === 'object') {
					service.linedJSON.push({key:prefix+key, val:"{", debth:debth});
					walk(val, prefix+key, debth+1);				
				} else {
					service.linedJSON.push({key:prefix+key, val:val, debth:debth});
				}
			}
		}
	}
	String.prototype.replaceAt=function(index, character) {
		 return this.substr(0, index) + character + this.substr(index+character.length);
	}
	function escapeRegExp(str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}
	return service;
});