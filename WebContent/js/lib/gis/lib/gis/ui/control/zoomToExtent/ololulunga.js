gis.ui.control.zoomToExtent.ololulunga = function(spec,my){
	my = my || {};

	var that = gis.ui.control.zoomToExtent(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'zoomToOlolulunga';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Zoom To Ololulunga';

	my.bounds = gistools.settingObj.getBounds("Ololulunga");

	that.CLASS_NAME =  "gis.ui.control.zoomToExtent.ololulunga";
	return that;
};