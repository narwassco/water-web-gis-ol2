/**
 * 正多角形の穴あきポリゴンを作成するコントロール
 */
gis.ui.control.regular.interior = function(spec,my){
	my = my || {};

	var that = gis.ui.control.regular(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'drawRegularInt';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Draw Regular feature with hole';
	
	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = new OpenLayers.Control.DrawHole(my.editingLayer,
    		OpenLayers.Handler.RegularPolygon,
    		{handlerOptions: {sides: 5}});
	
	my.dialog = gis.ui.dialog({ divid : my.id });
	
	that.CLASS_NAME =  "gis.ui.control.regular.interior";
	return that;
};