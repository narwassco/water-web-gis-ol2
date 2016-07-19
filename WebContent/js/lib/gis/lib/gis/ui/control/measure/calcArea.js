/**
 * 面積計算を行うコントロール
 */
gis.ui.control.measure.calcArea = function(spec,my){
	my = my || {};

	var that = gis.ui.control.measure(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'calcArea';
	
	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || 'calcArea';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Measure Area';
	
	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = new OpenLayers.Control.Measure(
            OpenLayers.Handler.Polygon, {
                persist: true,
                handlerOptions: {
                    layerOptions: {
                        renderers: my.getRendrer(),
                        styleMap: my.getStyleMap()
                    }
                }
            }
        );
	
	that.CLASS_NAME =  "gis.ui.control.measure.calcArea";
	return that;
};