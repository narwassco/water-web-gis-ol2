gis.setting = function(spec,my){
	var that= {};

	my = my || {};

	my.values = {};

	my.getFromServer = function(){
		$.ajax({
			url : './rest/Setting',
			type : 'GET',
			dataType : 'json',
			cache : false,
			async : false
    	}).done(function(json){
    		if (json.code !== 0){
    			alert(json.message);
    			return;
    		}
    		my.values = json.value;
    	}).fail(function(xhr){
			console.log(xhr.status + ';' + xhr.statusText);
			return false;
    	});
	}

	my.getValue = function(key){
		if (!my.values[key]){
			return null;
		}else{
			return my.values[key];
		}
	};

	that.init = function(){
		my.getFromServer();
	};

	that.getMapServUrl = function(){
		return my.getValue("MapServerUrl");
	}

	that.getBounds = function(name){
		var values = JSON.parse(my.getValue("bounds"));
		if (!values[name]){
			return null;
		}else{
			return new OpenLayers.Bounds(values[name]);
		}
	}

	that.CLASS_NAME =  "gis.setting";
	return that;
};