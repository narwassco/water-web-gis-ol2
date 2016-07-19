gis.ui.control.zoomToExtent.naroktown = function(spec,my){
	my = my || {};

	var that = gis.ui.control.zoomToExtent(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'zoomToNaroktown';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Zoom To Narok';

	my.bounds = gistools.settingObj.getBounds("Narok");

	that.CLASS_NAME =  "gis.ui.control.zoomToExtent.naroktown";
	return that;
};