/**
 * 計測コントロールのスーパークラス
 */
gis.ui.control.measure = function(spec, my) {
	my = my || {};

	var that = gis.ui.control(spec, my);

	my.txtOutputId = "";

	/**
	 * 地図関係の編集コントロールかどうか
	 */
	my.isOlControl = true;
	
	my.sketchSymbolizers = spec.sketchSymbolizers || {
		"Point" : {
			pointRadius : 4,
			graphicName : "square",
			fillColor : "white",
			fillOpacity : 1,
			strokeWidth : 1,
			strokeOpacity : 1,
			strokeColor : "#333333"
		},
		"Line" : {
			strokeWidth : 3,
			strokeOpacity : 1,
			strokeColor : "#666666",
			strokeDashstyle : "dash"
		},
		"Polygon" : {
			strokeWidth : 2,
			strokeOpacity : 1,
			strokeColor : "#666666",
			fillColor : "white",
			fillOpacity : 0.3
		}
	};

	my.getStyleMap = function() {
		var style = new OpenLayers.Style();
		style.addRules([ new OpenLayers.Rule({
			symbolizer : my.sketchSymbolizers
		}) ]);
		var styleMap = new OpenLayers.StyleMap({
			"default" : style
		});
		return styleMap;
	};

	my.getRendrer = function() {
		var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
		renderer = (renderer) ? [ renderer ]
				: OpenLayers.Layer.Vector.prototype.renderers;
		return renderer;
	};

	/**
	 * 計測結果を反映するためのハンドラ
	 */
	my.handleMeasurements = function(event) {
		// var geometry = event.geometry;
		var units = event.units;
		var order = event.order;
		var measure = event.measure;
		var out = "";
		if (order == 1) {
			out += measure.toFixed(3) + " " + units;
		} else {
			out += measure.toFixed(3) + " " + units + "2";
		}
		$("#" + my.txtOutputId).val(out);
	};

	/**
	 * OpenLayers.Mapオブジェクトにコントロールを追加する前の処理
	 */
	my.beforeAddControlInMap = function(map) {
		my.olControl.events.on({
			"measure" : my.handleMeasurements,
			"measurepartial" : my.handleMeasurements
		});
	};

	my.isInit = false;
	
	/**
	 * コンストラクタ
	 */
	my.init = function(){
		if (my.isInit === true){
			return;
		}
		var html = "<div id='" + my.value + "dialog'></div>";
		$("#" + my.id).after(html);
		my.initDialog();
		my.isInit = true;
	};
	
	/**
	 * ダイアログ初期化
	 */
	my.initDialog = function(){
		my.txtOutputId = my.value + "_output";
		var html = "<ul id='" + my.value + "_option'>"
			+ "<li>"
			+ "<input type='checkbox' name='geodesic' id='" + my.value + "_geodesicToggle'/>" 
			+ "<label for='" + my.value + "_geodesicToggle'>Use Geodesic</label>"
			+ "</li>" 
			+ "<li>"
			+ "<input type='checkbox' name='immediate' id='" + my.value + "_immediateToggle'/>" 
			+ "<label for='" + my.value + "_immediateToggle'>Realtime Calculating</label>"
			+ "</li>"
			+ "<li>"
		+ "Value：" + "<br>" 
		+ "<input type='text' id='" + my.txtOutputId + "' style='width:150px'>"
		+ "</li>"
		+ "</ul>";
		$("#" + my.value + "dialog").html(html);
		$("#" + my.value + "_geodesicToggle").click(function() {
			my.control_update(document.getElementById($(this).attr('id')));
		});
		$("#" + my.value + "_immediateToggle").click(function() {
			my.control_update(document.getElementById($(this).attr('id')));
		});
		$("#" + my.value + "dialog").dialog({
			title : 'Measure Option',
			autoOpen : false,
			modal : false,
			position : [0,0],
			close : function(){
				that.deactivate();
			}
		});
	};
	
	/**
	 * オプションツール設定変更時の反映
	 */
	my.control_update = function(){
		var geodesicToggle = document.getElementById(my.value + "_geodesicToggle");
        var immediateToggle = document.getElementById(my.value + "_immediateToggle");
        my.olControl.geodesic = geodesicToggle.checked;
        my.olControl.setImmediate(immediateToggle.checked);
	};
	
	/**
	 * コントロールがアクティブになった後の処理（オプション用）
	 */
	my.afterActivate = function(){
		my.init();
		$("#" + my.value + "dialog").dialog('open');
	};
	
	/**
	 * コントロールが非アクティブになった後の処理
	 */
	my.afterDeactivate = function(){
		$("#" + my.value + "dialog").dialog('close');
	};

	that.CLASS_NAME = "gis.ui.control.measure";
	return that;
};