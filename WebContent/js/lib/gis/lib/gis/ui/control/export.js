/**
 * 編集レイヤ上のフィーチャを全削除するコントロール
 */
gis.ui.control.export = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'export';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Export';
	
	my.fomats = ['GML','KML','GeoJSON','GeoRSS','WKT'];
	
	my.dialog = gis.ui.dialog({ divid : my.id });
	
	/**
	 * コンストラクタ
	 */
	my.init = function(){
		var html = my.getHtml();
		my.dialog.create(html,{
			title : 'Export Data',
			modal : true,
			height : 350,
			width : 500,
			position : 'center',
			buttons : {
				'Refresh Map' : function(){
					my.getData();
				},
				'Close' : function(){
					$(this).dialog('close');
				}
			}
		},my.initUI);
	};
	
	my.getHtml = function(){
		var html = "<select id='savecombobox' class='gis-ui-control-save-combobox'></select>";
		html += "<br>";
		html += "<textarea id='txtFormatedData' style='width:90%;height:75%'></textarea>";
		return html;
	};
	
	my.initUI = function(){
		var items = "";
		for (var i = 0 in my.fomats){
			var format = my.fomats[i];
			items += "<option value='" + format + "'>" + format + "</option>";
		}
		$("#savecombobox").append(items);
		
		$("#savecombobox").change(function(){
			my.getData();
		});
	};
	
	/**
	 * ベクタレイヤのフィーチャを指定フォーマットで取得してコンテンツ表示
	 */
	my.getData = function(){
		var content = "";
		if (my.editingLayer.features.length !== 0){
			var selectedFormat = $("#savecombobox").val();
			var objformat = new OpenLayers.Format[selectedFormat]({
				'internalProjection': my.editingLayer.map.projection,
				'externalProjection': my.editingLayer.map.displayProjection
			});
			content = objformat.write(my.editingLayer.features);
		}
		$("#txtFormatedData").text(content);
	};
	
	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		my.init();
		if (!my.editingLayer){
			return;
		}
		my.getData();
		my.dialog.open();

	};
	
	that.CLASS_NAME =  "gis.ui.control.export";
	return that;
};