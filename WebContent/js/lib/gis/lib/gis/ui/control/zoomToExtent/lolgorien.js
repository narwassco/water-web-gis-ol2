gis.ui.control.zoomToExtent.lolgorien = function(spec,my){
	my = my || {};

	var that = gis.ui.control.zoomToExtent(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'zoomToLolgorien';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Zoom To Lolgorien';

	my.bounds = gistools.settingObj.getBounds("Lolgorien");

	that.CLASS_NAME =  "gis.ui.control.zoomToExtent.lolgorien";
	return that;
};