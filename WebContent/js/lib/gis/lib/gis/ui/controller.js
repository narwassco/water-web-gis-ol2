gis.ui.controller = function(spec,my){
	my = my || {};

	var that = gis.ui(spec,my);
	
	that.CLASS_NAME =  "gis.ui.controller";
	return that;
};