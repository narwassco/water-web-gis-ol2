/**
 * ラインを作成するコントロール
 */
gis.ui.control.drawLine = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'drawLine';
	
	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || 'drawLine';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Draw Line';
	
	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = new OpenLayers.Control.DrawFeature(my.editingLayer,OpenLayers.Handler.Path);
	
	/**
	 * 地図関係の編集コントロールかどうか
	 */
	my.isOlControl = true;
	
	that.CLASS_NAME =  "gis.ui.control.drawLine";
	return that;
};