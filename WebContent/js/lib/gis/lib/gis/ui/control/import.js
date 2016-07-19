/**
 * WKTを編集レイヤに表示するコントロール
 */
gis.ui.control.import = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'import';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Import Data';
	
	my.dialog = gis.ui.dialog({ divid : my.id });
	
	/**
	 * コンストラクタ
	 */
	my.init = function(){
		var html = my.getHtml();
		my.dialog.create(html,{
			title : 'Import WKT data',
			modal : true,
			height : 350,
			width : 500,
			position : 'center',
			buttons : {
				'View' : my.btnAddWkt_onClick,
				'Close' : function(){
					$(this).dialog('close');
				}
			}
		});
	};
	
	my.getHtml = function(){
		var html = "<textarea id='txtWkt' style='width:90%;height:90%'></textarea>";
		return html;
	};
	
	/**
	 *WKT表示ボタンイベント
	 */
	my.btnAddWkt_onClick = function(){
		var wkt = $("#txtWkt").val();
		if (wkt === ''){
    		return;
    	}
    	WKTformat = new OpenLayers.Format.WKT(
				{
					'internalProjection': my.map.displayProjection,
					'externalProjection': my.map.projection
				}
			);
    	var geometry = new OpenLayers.Geometry.fromWKT(wkt);
    	geometry.transform(my.map.displayProjection,my.map.projection);
    	var feature = gis.geometryOp.toFeature(geometry);
    	my.editingLayer.addFeatures([feature]);
    	my.map.zoomToExtent(feature.geometry.bounds);
	};
	
	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		my.init();
		if (!my.editingLayer){
			return;
		}
		my.dialog.open();

	};
	
	that.CLASS_NAME =  "gis.ui.control.import";
	return that;
};