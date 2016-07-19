/**
 * ポリゴンを作成するコントロール
 */
gis.ui.control.drawPolygon = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'drawPolygon';
	
	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || 'drawPolygon';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Draw Polygon';
	
	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = new OpenLayers.Control.DrawFeature(my.editingLayer,OpenLayers.Handler.Polygon);
	
	/**
	 * 地図関係の編集コントロールかどうか
	 */
	my.isOlControl = true;
	
	that.CLASS_NAME =  "gis.ui.control.drawPolygon";
	return that;
};