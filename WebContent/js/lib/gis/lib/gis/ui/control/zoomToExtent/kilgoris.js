gis.ui.control.zoomToExtent.kilgoris = function(spec,my){
	my = my || {};

	var that = gis.ui.control.zoomToExtent(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'zoomToKilgoris';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Zoom To Kilgoris';

	my.bounds = gistools.settingObj.getBounds("Kilgoris");

	that.CLASS_NAME =  "gis.ui.control.zoomToExtent.kilgoris";
	return that;
};