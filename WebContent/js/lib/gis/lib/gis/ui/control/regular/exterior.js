/**
 * 正多角形を追加するコントロール
 */
gis.ui.control.regular.exterior = function(spec,my){
	my = my || {};

	var that = gis.ui.control.regular(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'drawRegularExt';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Draw Regular Feature';
	
	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = new OpenLayers.Control.DrawFeature(my.editingLayer,
    		OpenLayers.Handler.RegularPolygon,
    		{handlerOptions: {sides: 5}});
	
	my.dialog = gis.ui.dialog({ divid : my.id });
	
	that.CLASS_NAME =  "gis.ui.control.regular.exterior";
	return that;
};