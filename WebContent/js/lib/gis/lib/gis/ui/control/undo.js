gis.ui.control.undo = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'undo';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Undo';
	
	my.controller = spec.controller;
	
	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		my.controller.undo();
	};
	
	that.CLASS_NAME =  "gis.ui.control.undo";
	return that;
};