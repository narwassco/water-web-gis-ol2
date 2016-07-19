gis.ui.control.redo = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'redo';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Redo';
	
	my.controller = spec.controller;
	
	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		my.controller.redo();
	};
	
	that.CLASS_NAME =  "gis.ui.control.redo";
	return that;
};