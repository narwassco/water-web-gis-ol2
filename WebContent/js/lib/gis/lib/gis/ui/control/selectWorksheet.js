/**
 * 図形を選択するコントロール
 */
gis.ui.control.selectWorksheet = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'selectWorksheet';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Select O&M Worksheet';

	/**
	 * 地図関係の編集コントロールかどうか
	 */
	my.isOlControl = true;

	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = new OpenLayers.Control.SelectFeature([my.editingLayer],{
    	clickout: true, toggle: true,
        multiple: false, hover: false
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
		//
	};

	my.getHtml = function(attr){
		var materialhtml = my.getMeterialHtml(attr["UsedMaterials"]);

		var fields = [
		              {id : "workno", label : "Work No"}
		              ,{id : "worktypename", label : "Type of O&M Work"}
		              ,{id : "name", label : "Name of Officer"}
		              ,{id : "designation", label : "Disignation"}
		              ,{id : "inputdate", label : "Date"}
		              ,{id : "roadname", label : "Name of Road"}
		              ,{id : "worklocation", label : "Location"}
		              ,{id : "lekagescale", label : "Scale of Lekage"}
		              ,{id : "dateofwork", label : "Date of Work"}
		              ,{id : "workersno", label : "No. of Workers"}
		              ,{id : "timetaken", label : "Time Taken for Work(minutes)"}
		              ,{id : -1, html : materialhtml}
		              ,{id : "pipe_material", label : "Pipe Material"}
		              ,{id : "pipe_diameter", label : "Pipe Diameter(mm)"}
		              ,{id : "pipe_depth", label : "Pipe Depth(mm)"}
		              ,{id : "land_class", label : "Landownership Classification"}
		              ,{id : "pipe_class", label : "Pipe Classification"}
		              ,{id : "surface", label : "Surface"}
		              ,{id : "work_point", label : "The Point of Works"}
		              ,{id : "comments", label : "Comment"}
		              ];

		var html = "<table class='dialogstyle'>";
		for (var i = 0 in fields){
			var f = fields[i];
			if (f.id === -1){
				html += f.html;
			}else{
				html += "<tr>" +
						"<th style='width:40%'>" + f.label + "</th>" +
						"<td style='width:60%'>" + attr[f.id] + "</td>" +
						"</tr>"
			}
		}

		return html;
	};

	my.getMeterialHtml = function(materials){
		var html = "<table class='dialogstyle' style='width:100%'>" +
				"<tr><th>No.</th>" +
				"<th>Item Description</th>" +
				"<th>Unit</th>" +
				"<th>Quantity</th>" +
				"<th>Remarks</th></tr>";
		for (var i in materials){
			var m = materials[i];
			html += "<tr><td>" + m["seqno"] + "</td>"
				+"<td>" + m["description"] + "</td>"
				+"<td>" + m["unit"] + "</td>"
				+"<td>" + m["quantity"] + "</td>"
				+"<td>" + m["remarks"] + "</td></tr>";
		}
		html += "</table>";
		html = "<tr><th colspan='2'>Material(s) Userd for Work</td></tr>"
						+ "<tr><td colspan='2'>" + html + "</td></tr>";
		return html;
	};

	/**
	 * フィーチャ選択時のイベント定義
	 */
	my.callbacks = {
            "featureselected": function(e) {
            	var f = e.feature;
            	if (my.popupManager[f.id]){
            		my.popupManager[f.id].show();
            		return;
            	}

            	$.ajax({
    				url : './rest/Worksheets/?workno=' + f.attributes.workno,
    				type : 'GET',
    				dataType : 'json',
    				cache : false,
    				async : true
    	    	}).done(function(json){
    	    		if (json.code !== 0){
    	    			alert(json.message);
    	    			return;
    	    		}
    	    		var html = my.getHtml(json.value);
    	    		var map = my.editingLayer.map;
    	    		var popup = new OpenLayers.Popup.FramedCloud(
    	    				f.id,
    	    				f.geometry.getBounds().getCenterLonLat(),
    	        			new OpenLayers.Size(170, 300),
    	        			html,
    	        			null,
    	        			true);

    	    		map.addPopup(popup);
                	my.popupManager[f.id] = popup;
    	    	}).fail(function(xhr){
    				console.log(xhr.status + ';' + xhr.statusText);
    				return false;
    	    	});
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
		my.editingLayer.setVisibility(true);
		my.editingLayer.events.on(my.callbacks);
		my.olControl.activate();
	};

	/**
	 * コントロールが非アクティブになった後の処理
	 */
	my.afterDeactivate = function(){
		my.editingLayer.events.un(my.callbacks);
		my.olControl.deactivate();
	};

	that.CLASS_NAME =  "gis.ui.control.selectWorksheet";
	return that;
};