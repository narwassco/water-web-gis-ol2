/**
 * ポイントを作成するコントロール
 */
gis.ui.control.drawPoint = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'drawPoint';
	
	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || 'drawPoint';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Draw Point';
	
	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = new OpenLayers.Control.DrawFeature(my.editingLayer,OpenLayers.Handler.Point);
	
	/**
	 * 地図関係の編集コントロールかどうか
	 */
	my.isOlControl = true;
	
	that.CLASS_NAME =  "gis.ui.control.drawPoint";
	return that;
};