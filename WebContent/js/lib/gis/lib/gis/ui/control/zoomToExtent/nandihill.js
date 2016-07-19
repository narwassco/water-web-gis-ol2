gis.ui.control.zoomToExtent.nandihill = function(spec,my){
	my = my || {};

	var that = gis.ui.control.zoomToExtent(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'zoomToNandiHill';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Zoom To Nandi Hill';

	my.bounds = gistools.settingObj.getBounds("NandiHill");

	that.CLASS_NAME =  "gis.ui.control.zoomToExtent.nandihill";
	return that;
};