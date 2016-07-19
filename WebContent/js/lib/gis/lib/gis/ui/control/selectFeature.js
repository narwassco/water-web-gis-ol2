/**
 * 図形を選択するコントロール
 */
gis.ui.control.selectFeature = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'selectFeature';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Select Feature';

	/**
	 * 地図関係の編集コントロールかどうか
	 */
	my.isOlControl = true;

	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = new OpenLayers.Control.SelectFeature([my.editingLayer],{
    	clickout: false, toggle: true,
        multiple: true, hover: false
    		});

	/**
	 * ポップアップマネージャ
	 */
	my.popupManager = {};

	my.dialog = gis.ui.dialog({ divid : my.id });

	/**
	 * コンストラクタ
	 */
	my.init = function(){
		var html = my.getHtml();
		my.dialog.create(html,{
			title : 'Select Option',
			close : function(){
				that.deactivate();
			}
		});
	};

	my.getHtml = function(){
		var html = "<ul>" +
			"<li>" +
			"<input type='checkbox' name='chkGetWkt' id='chkGetWkt'/>" +
			"<label for='chkGetWkt'>Show WKT</label>" +
			"</li>" +
		"</ul>";
		return html;
	};

	/**
	 * フィーチャ選択時のイベント定義
	 */
	my.callbacks = {
            "featureselected": function(e) {
            	var isChecked = $("#chkGetWkt").is(':checked');
            	if (isChecked === false){
            		return;
            	}
            	if (my.popupManager[e.feature.id]){
            		my.popupManager[e.feature.id].show();
            		return;
            	}
            	var map = my.editingLayer.map;
            	var geom = e.feature.geometry.clone().transform(map.projection,map.displayProjection);
            	var html = "<table><tr><td class='gis-ui-control-selectfeature-popup'>" + geom.toString() + "</td></tr></table>";
            	var popup = new OpenLayers.Popup.FramedCloud(
            			e.feature.id,
            			e.feature.geometry.getBounds().getCenterLonLat(),
            			new OpenLayers.Size(100,100),
            			html,
            			null,
            			true
            	);
            	map.addPopup(popup);
            	my.popupManager[e.feature.id] = popup;
            },
            "featureunselected": function(e) {
            	if (my.popupManager[e.feature.id]){
            		my.popupManager[e.feature.id].hide();
            	}
            }
	};

	/**
	 * コントロールがアクティブになった後の処理（オプション用）
	 */
	my.afterActivate = function(){
		my.init();
		my.editingLayer.events.on(my.callbacks);
		my.dialog.open();
	};

	/**
	 * コントロールが非アクティブになった後の処理
	 */
	my.afterDeactivate = function(){
		my.editingLayer.events.un(my.callbacks);
		my.dialog.close();
	};

	that.CLASS_NAME =  "gis.ui.control.selectFeature";
	return that;
};