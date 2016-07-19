/**
 * 選択されたフィーチャを削除するコントロール
 */
gis.ui.control.deleteFeature = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'deleteFeature';
	
	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || 'deleteFeature';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Delete Feature';
	
	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = new OpenLayers.Control.DeleteFeature(my.editingLayer);
	
	/**
	 * 地図関係の編集コントロールかどうか
	 */
	my.isOlControl = true;
	
	that.CLASS_NAME =  "gis.ui.control.deleteFeature";
	return that;
};