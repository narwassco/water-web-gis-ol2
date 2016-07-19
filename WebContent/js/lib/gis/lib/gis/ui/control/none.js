/**
 * 何もしないデフォルトのコントロール
 */
gis.ui.control.none = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'none';
	
	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || 'none';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Drag';
	
	/**
	 * デフォルトのチェック状態
	 */
	my.defaultchecked = true;
	
	/**
	 * 地図関係の編集コントロールかどうか
	 */
	my.isOlControl = true;
	
	that.CLASS_NAME =  "gis.ui.control.none";
	return that;
};