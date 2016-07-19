/**
 * 距離計算を行うコントロール
 */
gis.ui.control.measure.calcDistance = function(spec,my){
	my = my || {};

	var that = gis.ui.control.measure(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'calcDistance';
	
	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || 'calcDistance';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Measure Distance';
	
	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = new OpenLayers.Control.Measure(
            OpenLayers.Handler.Path, {
                persist: true,
                handlerOptions: {
                    layerOptions: {
                        renderers: my.getRendrer(),
                        styleMap: my.getStyleMap()
                    }
                }
            }
        );
	
	that.CLASS_NAME =  "gis.ui.control.measure.calcDistance";
	return that;
};