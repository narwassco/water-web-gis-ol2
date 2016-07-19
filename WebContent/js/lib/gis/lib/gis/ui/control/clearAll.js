/**
 * 編集レイヤ上のフィーチャを全削除するコントロール
 */
gis.ui.control.clearAll = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'clearAll';
	
	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || 'clearAll';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Clear Features';
	
	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		my.editingLayer.removeAllFeatures();
	};
	
	that.CLASS_NAME =  "gis.ui.control.clearAll";
	return that;
};