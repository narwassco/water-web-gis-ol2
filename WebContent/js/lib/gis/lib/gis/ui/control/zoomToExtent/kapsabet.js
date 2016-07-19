gis.ui.control.zoomToExtent.kapsabet = function(spec,my){
	my = my || {};

	var that = gis.ui.control.zoomToExtent(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'zoomToKapsabet';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Zoom To Kapsabet';

	my.bounds = gistools.settingObj.getBounds("Kapsabet");

	that.CLASS_NAME =  "gis.ui.control.zoomToExtent.kapsabet";
	return that;
};