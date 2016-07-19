/**
 * ポリゴンを分割するコントロール
 */
gis.ui.control.splitPolygon = function(spec, my) {
	my = my || {};

	var that = gis.ui.control(spec, my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'splitPolygon';

	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || 'splitPolygon';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Split Polygon';

	my.getSplitPolygonControl = function() {
		var split = new OpenLayers.Control.SplitPolygon(my.editingLayer);
		my.editingLayer.events.register('aftersplit', my.editingLayer,
				function(e) {
					my.flashFeatures(e.add);
				});
		return split;
	};

	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = my.getSplitPolygonControl();
	
	/**
	 * 地図関係の編集コントロールかどうか
	 */
	my.isOlControl = true;

	that.CLASS_NAME = "gis.ui.control.splitPolygon";
	return that;
};