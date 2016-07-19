gis.ui.control.splitLine = function(spec, my) {
	my = my || {};

	var that = gis.ui.control(spec, my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'splitLine';

	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || 'splitLine';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Split Line';

	my.getSplitControl = function() {
		var split = new OpenLayers.Control.Split({
			layer : my.editingLayer,
			// tolerance: 0.0001,
			// deferDelete: true,
			eventListeners : {
				aftersplit : function(event) {
					my.flashFeatures(event.features);
				}
			}
		});
		return split;
	};

	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = my.getSplitControl();
	
	/**
	 * 地図関係の編集コントロールかどうか
	 */
	my.isOlControl = true;

	my.snappingControl = new OpenLayers.Control.Snapping({layer: my.editingLayer});
	
	/**
	 * OpenLayers.Mapオブジェクトにコントロールを追加する前の処理
	 */
	my.beforeAddControlInMap = function(map){
		map.addControl(my.snappingControl);
	};
	
	/**
	 * コントロールがアクティブになった後の処理（オプション用）
	 */
	my.afterActivate = function(){
		my.snappingControl.activate();
	};
	
	that.CLASS_NAME = "gis.ui.control.splitLine";
	return that;
};