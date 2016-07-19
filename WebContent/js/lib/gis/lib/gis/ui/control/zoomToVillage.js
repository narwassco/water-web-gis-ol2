/**
 * WKTを編集レイヤに表示するコントロール
 */
gis.ui.control.zoomToVillage = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'zoomToVillage';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Zoom To Village';

	my.dialog = gis.ui.dialog({ divid : my.id });

	my.villages = null;

	my.isInit = false;

	my.comboboxId = 'cmbvillage_' + my.id;

	/**
	 * コンストラクタ
	 */
	my.init = function(){
		if (my.isInit === true){
			return;
		}

		my.getVillages();
		var html = my.getDialogHtml();
		my.dialog.create(html,{
			title : 'Zoom To Village',
			modal : true,
			position : 'center',
			buttons : {
				'View' : my.btnZoomToVillage_onClick,
				'Close' : function(){
					$(this).dialog('close');
				}
			}
		});

		my.isInit = true;
	};

	my.getDialogHtml = function(){
		var html = "<select id='" + my.comboboxId + "' style='width:100%'>";
		for (var i = 0 in my.villages){
			var v = my.villages[i];
			html += "<option value='" + v.villageid + "'>" + v.villageid + ":" + v.name + "</option>";
		}
		html += "</select>";
		return html;
	};

	my.getVillages = function(){
		$.ajax({
			url : './rest/Villages/',
			type : 'GET',
			dataType : 'json',
			cache : false,
			async : false
    	}).done(function(json){
    		if (json.code !== 0){
    			alert(json.message);
    			return;
    		}
    		var villages = json.value
    		my.villages = {};
    		for (var i = 0 in villages){
    			var v = villages[i];
    			if (v.wkt === null){
    				continue;
    			}
    			v.geom = OpenLayers.Geometry.fromWKT(v.wkt);
    			my.villages[v.villageid] = v;
    		}
    	}).fail(function(xhr){
			console.log(xhr.status + ';' + xhr.statusText);
			return false;
    	});
	}

	my.btnZoomToVillage_onClick = function(){
		var id = $("#" + my.comboboxId).val();
		var village = my.villages[id];
		my.map.zoomToExtent(village.geom.getBounds().transform(my.map.displayProjection,my.map.projection));
		my.map.zoomIn();
		my.dialog.close();
	};
	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		my.init();
		my.dialog.open()
	}

	that.CLASS_NAME =  "gis.ui.control.zoomToVillage";
	return that;
};