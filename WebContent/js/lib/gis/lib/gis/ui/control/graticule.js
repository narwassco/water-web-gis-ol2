/**
 * 経緯度線の表示非表示を切り替えるコントロール
 */
gis.ui.control.graticule = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'graticule';
	
	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || 'graticule';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Graticule Visble/Unvisible';
	
	/**
	 * デフォルトのチェック状態
	 */
	my.defaultchecked = false;
	
	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = new OpenLayers.Control.Graticule({
			numPoints: 25,
			labelled: true,
			displayInLayerSwitcher:false
		});
	
	my.isInit = false;
	
	/**
	 * コンストラクタ
	 */
	my.init = function(){
		if (my.isInit === true){
			return;
		}
		that.addControlInMap(my.map);
		my.isInit = true;
		my.toggleCallback();
	};
	
	/**
	 * コントロールがアクティブになった後の処理（オプション用）
	 */
	my.afterActivate = function(){
		my.toggleCallback();
	};
	
	/**
	 * コントロールが非アクティブになった後の処理
	 */
	my.afterDeactivate = function(){
		my.toggleCallback();
	};
	
	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		if (my.defaultchecked === true){
			my.olControl.activate();
		}else{
			my.olControl.deactivate();
		}
		my.defaultchecked = !my.defaultchecked;
	};
	
	//コンストラクタ実行
	my.init();
	
	that.CLASS_NAME =  "gis.ui.control.graticule";
	return that;
};