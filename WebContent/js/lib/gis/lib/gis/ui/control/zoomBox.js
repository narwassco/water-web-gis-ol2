/**
 * 矩形から表示範囲を変更するコントロール
 */
gis.ui.control.zoomBox = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'zoombox';
	
	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || 'zoombox';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Zoom Box';
	
	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = new OpenLayers.Control.ZoomBox();
	
	/**
	 * 地図関係の編集コントロールかどうか
	 */
	my.isOlControl = true;
	
	that.CLASS_NAME =  "gis.ui.control.zoomBox";
	return that;
};