/**
 * マウスの表示位置座標を取得するコントロール
 */
gis.ui.control.mousePosition = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'mousePosition';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Mouse Position';
	
	/**
	 * デフォルトのチェック状態
	 */
	my.defaultchecked = false;
	
	/**
	 * コントロールがアクティブになった後の処理（オプション用）
	 */
	my.afterActivate = function(){
		my.ctrlEnabled();
	};
	
	/**
	 * コントロールが非アクティブになった後の処理
	 */
	my.afterDeactivate = function(){
		my.ctrlEnabled();
	};
	
	/**
	 * マウス位置表示用のフィーチャオブジェクト
	 */
	my.labelfeature = null;
	
	my.dialog = gis.ui.dialog({ divid : my.id });
	
	/**
	 * コンストラクタ
	 */
	my.init = function(){
		var html = my.getHtml();
		my.dialog.create(html,{
			title : my.label,
			close : function(){
				my.map.events.unregister("mousemove", my.map, my.positionCallback);
			}
		});
	};
	
	my.getHtml = function(){
		var types = {"x" : "X","y" : "Y" , "lon" : "Longitude", "lat" : "Latitude"};
		var html = "<table>";
		for (var id in types){
			var name = types[id];
			html += "<tr><td><label class='gis-ui-control-mouseposition-label'>" + name + "</label></td>" +
			"<td><input type='text' class='gis-ui-control-mouseposition-txt' id='" + my.id + "_" + id + "' readonly/></td></tr>";
		}
		html += "</table>";
		return html;
	};
	
	my.getHtmlforStatus = function(){
		var types = {"x" : "X","y" : "Y" , "lon" : "Longitude", "lat" : "Latitude"};
		var html = "";
		for (var id in types){
			var name = types[id];
			html += "<td><label class='gis-ui-control-mouseposition-label'>" + name + "</label>" +
			"<td><input type='text' class='gis-ui-control-mouseposition-txt' id='" + my.id + "_" + id + "' readonly/></td>";
		}
		return html;
	};
	
	my.positionCallback = function(e){
		var position = this.events.getMousePosition(e);
		var lonlat =  my.map.getLonLatFromViewPortPx(position);
		
		$("#" + my.id + "_x").val(position.x);
		$("#" + my.id + "_y").val(position.y);
		
		var point = new OpenLayers.Geometry.Point(lonlat.lon,lonlat.lat);
		point = point.transform(my.map.projection,my.map.displayProjection);
		var ptop = gis.geometryOp.pointOp({geometry:point});
		var point = ptop.floor();
		
		$("#" + my.id + "_lon").val(point.x);
		$("#" + my.id + "_lat").val(point.y);
	};
	
	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		my.init();
		my.map.events.register("mousemove", my.map, my.positionCallback);
		my.dialog.open();
	};
	
	that.initforStatus = function(divid){
		var html = my.getHtmlforStatus();
		$("#" + divid).append(html);
		my.map.events.register("mousemove", my.map, my.positionCallback);
	};	
	
	that.CLASS_NAME =  "gis.ui.control.mousePosition";
	return that;
};