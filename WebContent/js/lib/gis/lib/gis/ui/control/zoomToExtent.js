gis.ui.control.zoomToExtent = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'zoomToExtent';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Zoom To Extent';

	/**
	 * OpenLayers.Mapオブジェクト
	 */
	my.map = spec.map;

	my.bounds = new OpenLayers.Bounds([35.8,-1.1,35.9,-1.0]);

	/**
	 * コンストラクタ
	 */
	my.init = function(){
	};

	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		my.map.zoomToExtent(my.bounds.transform(my.map.displayProjection,my.map.projection));
	}

	that.CLASS_NAME =  "gis.ui.control.zoomToExtent";
	return that;
};