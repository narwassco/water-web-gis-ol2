/**
 * 穴あきポリゴンを作成するコントロール
 */
gis.ui.control.drawHole = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'drawHole';
	
	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || 'drawHole';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Draw Hole Polygon.';
	
	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = new OpenLayers.Control.DrawHole(my.editingLayer,OpenLayers.Handler.Polygon);
	
	/**
	 * 地図関係の編集コントロールかどうか
	 */
	my.isOlControl = true;
	
	that.CLASS_NAME =  "gis.ui.control.drawHole";
	return that;
};