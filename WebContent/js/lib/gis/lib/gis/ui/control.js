/**
 * 地図編集コントロールを管理するスーパークラス
 */
gis.ui.control = function(spec,my){
	my = my || {};

	var that = gis.ui(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || undefined;

	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || undefined;

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || "";

	/**
	 * デフォルトのチェック状態
	 */
	my.defaultchecked = false;

	/**
	 * OpenLayers.Mapオブジェクト
	 */
	my.map = spec.map || undefined;

	/**
	 * 編集レイヤオブジェクト
	 */
	my.editingLayer = spec.editingLayer || undefined;

	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = undefined;

	/**
	 * 地図関係の編集コントロールかどうか
	 */
	my.isOlControl = false;

	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = spec.toggleCallback || undefined;

	/**
	 * パラメータで渡されたフィーチャを点滅させる
	 */
	my.flashFeatures = function(features, index) {
		if (!index) {
			index = 0;
		}
		var current = features[index];
		var layer = my.editingLayer;
		if (current && current.layer === layer) {
			layer.drawFeature(features[index], "select");
		}
		var prev = features[index - 1];
		if (prev && prev.layer === layer) {
			layer.drawFeature(prev, "default");
		}
		++index;
		if (index <= features.length) {
			window.setTimeout(function() {
				my.flashFeatures(features, index);
			}, 100);
		}
	};

	/**
	 * OpenLayers.Mapオブジェクトにコントロールを追加する前の処理
	 */
	my.beforeAddControlInMap = function(map){
		return;
	};

	/**
	 * コントロールのHTML作成後の後処理（オプション用）
	 */
	my.afterCreateHtml = function(){
		return;
	};

	/**
	 * コントロールがアクティブになった後の処理（オプション用）
	 */
	my.afterActivate = function(){
		return;
	};

	/**
	 * コントロールが非アクティブになった後の処理
	 */
	my.afterDeactivate = function(){
		return;
	};

	that.getId = function(){
		return my.id;
	};

	/**
	 * 地図編集コントロールかどうか
	 */
	that.isOlControl = function(){
		return my.isOlControl;
	};

	/**
	 * OpenLayersのコントロールを持っているかどうか
	 */
	that.haveOlControl = function(){
		if (my.olControl){
			return true;
		}else{
			return false;
		};
	};

	/**
	 * トグルチェンジのコールバック関数を設定する
	 */
	that.setToggleCallback = function(callback){
		my.toggleCallback = callback;
	};

	/**
	 * コントロールのHTMLを作成する
	 */
	that.createHtml = function(){
		my.id = "menu" + my.id;
		return "<a href='#' id='" + my.id + "'>" + my.label + "</a>";
	};

	that.createButtonHtml = function(){
		my.id = "btn" + my.id;
		return "<button id='" + my.id + "' class='gis-ui-buttonmenu'>" + my.label + "</button>"
	};


	/**
	 * OpenLayers.Mapオブジェクトにコントロールを追加する
	 */
	that.addControlInMap = function(map){
		if (!my.olControl){
    		return;
    	}
		my.beforeAddControlInMap(map);
    	map.addControl(my.olControl);
	};

	/**
	 * 指定されたエレメントの状態によってコントロールの状態を変更
	 * @param element DOMエレメント
	 */
	that.changeActivate = function(element){
		var isChecked = $("#" + my.id).is(':checked');
		if (isChecked === true){
			that.activate();
		}else{
			that.deactivate();
		}
	};

	/**
	 * コントロールをアクティブにする
	 */
	that.activate = function(){
		if (my.olControl){
			if (!my.olControl.active){
				my.olControl.activate();
			}
		}

		my.afterActivate();
	};

	/**
	 * コントロールを非アクティブにする
	 */
	that.deactivate = function(){
		if (my.olControl){
			if (my.olControl.active){
				my.olControl.deactivate();
			}
		}

		my.afterDeactivate();
	};

	/**
	 * コールバック関数を実行する
	 */
	that.execute = function(option){
		my.toggleCallback();
	};

	that.CLASS_NAME =  "gis.ui.control";
	return that;
};