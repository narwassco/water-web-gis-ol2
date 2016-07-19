/*

  gis.js -- Map Editor Library

  Copyright (c) 2015 by Jin Igarashi(Narok Water and Sewerage Services Company)

  this tool use OpenLayers, jquery and jquery-ui.

*/
/* ======================================================================
    gis/singleFile.js
   ====================================================================== */

/**
 * 圧縮された一つのファイルから参照されたときに読みこまれるファイル
 */
var gis = {
    /**
     * Constant: VERSION_NUMBER
     */
    VERSION_NUMBER: "Release 0.1",

    /**
     * Constant: singleFile
     * TODO: remove this in 3.0 when we stop supporting build profiles that
     * include gis.js
     */
    singleFile: true,

    /**
     * Method: _getScriptLocation
     * Return the path to this script. This is also implemented in
     * justice.js
     *
     * Returns:
     * {String} Path to this script
     */
    _getScriptLocation: (function() {
        var r = new RegExp("(^|(.*?\\/))(gis[^\\/]*?\\.js)(\\?|$)"),
            s = document.getElementsByTagName('script'),
            src, m, l = "";
        for(var i=0, len=s.length; i<len; i++) {
            src = s[i].getAttribute('src');
            if(src) {
                m = src.match(r);
                if(m) {
                    l = m[1];
                    break;
                }
            }
        }
        return (function() { return l; });
    })()
};
/* ======================================================================
    gis/geometryOp.js
   ====================================================================== */

/**
 * ジオメトリに対して操作を行うクラスのトップクラス
 */
gis.geometryOp = function(spec,my){
	var that= {};

	my = my || {};

	my.geometry = spec.geometry;
	
	/**
	 * OpenLayers.Geometryを取得する
	 * @returns {OpenLayers.Geometry}
	 */
	that.getGeometry = function(){
		return my.geometry;
	};
	
	/**
	 * OpenLayers.geometryを設定する
	 * @param geom OpenLayers.Geometry
	 */
	that.setGeometry = function(geom){
		my.geometry = geom;
	};
	
	/**
     * OpenLayers.GeometryからOpenLayers.Feature.Vectorを作成する
     * @returns {OpenLayers.Feature.Vector}
     */
    that.toFeature = function(){
    	var feature = new OpenLayers.Feature.Vector(my.geometry);
        feature.state = OpenLayers.State.INSERT;
        return feature;
    },
    
    that.toString = function(){
    	return my.geometry.toString();
    };
	
	that.CLASS_NAME =  "gis.geometryOp";
	return that;
};

/**
 * OpenLayers.GeometryからOpenLayers.Feature.Vectorを作成する
 * @param OpenLayers.Geometry
 * @returns {OpenLayers.Feature.Vector}
 */
gis.geometryOp.toFeature = function(geometry){
	var geomOp = gis.geometryOp({geometry : geometry});
	return geomOp.toFeature();
};
/* ======================================================================
    gis/ui.js
   ====================================================================== */

/**
 * uiコントロールの最上位クラス
 */
gis.ui = function(spec,my){
	var that= {};

	my = my || {};

	/**
	 * UIコントロールを表示するDIVタグID
	 */
	my.divid = spec.divid;

	that.getHeight = function(){
		return $("#" + my.divid).height();
	};

	that.CLASS_NAME =  "gis.ui";
	return that;
};
/* ======================================================================
    gis/ui/control.js
   ====================================================================== */

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
/* ======================================================================
    gis/ui/control/zoomToExtent.js
   ====================================================================== */

gis.ui.control.zoomToExtent = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'zoomToExtent';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Zoom To Extent';

	/**
	 * OpenLayers.Mapオブジェクト
	 */
	my.map = spec.map;

	my.bounds = new OpenLayers.Bounds([35.8,-1.1,35.9,-1.0]);

	/**
	 * コンストラクタ
	 */
	my.init = function(){
	};

	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		my.map.zoomToExtent(my.bounds.transform(my.map.displayProjection,my.map.projection));
	}

	that.CLASS_NAME =  "gis.ui.control.zoomToExtent";
	return that;
};
/* ======================================================================
    gis/ui/control/inputWorksheet.js
   ====================================================================== */

gis.ui.control.inputWorksheet = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'inputWorksheet';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Input O&M Worksheet';

	my.worksheetLayer = spec.worksheetLayer;

	my.dialog = gis.ui.dialog({ divid : my.id });

	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = new OpenLayers.Control.DrawFeature(my.editingLayer,OpenLayers.Handler.Point);

	/**
	 * 地図関係の編集コントロールかどうか
	 */
	my.isOlControl = true;

	my.isInit = false;

	my.officers = [];
	my.worktypes = [];
	my.fields = [];

	my.objInputUsedMaterial = null;

	my.geometry = null;

	/**
	 * コンストラクタ
	 */
	my.init = function(){
		if (my.isInit !== true){
			my.getWorktypes();
			my.getOfficers();
			my.setFields();
			my.dialog.create(my.getDialogHtml(),{
				title : 'Input O&M Worksheet',
				modal : true,
				position : 'center',
				width : 700,
				height : 600,
				buttons : {
					'Save' : my.btnSave_onClick,
					'Close' : function(){
						$(this).dialog('close');
					}
				}
			});
			$("#form" + my.id).validationEngine('attach',{
				promptPosition:"inline"
			});
			my.setDatePicker();
			my.isInit = true;
		}
	};

	my.getWorktypes = function(){
		$.ajax({
			url : './rest/WorkType/',
			type : 'GET',
			dataType : 'json',
			cache : false,
			async : false
    	}).done(function(json){
    		if (json.code !== 0){
    			alert(json.message);
    			return;
    		}
    		var types = json.value;
    		var data = [];
    		for (var i = 0 in types){
    			var x = types[i];
    			data.push({value:x.worktypeid,label:x.name})
    		}
    		my.worktypes = data;
    	}).fail(function(xhr){
			console.log(xhr.status + ';' + xhr.statusText);
			return false;
    	});
	};

	my.getOfficers = function(){
		$.ajax({
			url : './rest/Officers/',
			type : 'GET',
			dataType : 'json',
			cache : false,
			async : false
    	}).done(function(json){
    		if (json.code !== 0){
    			alert(json.message);
    			return;
    		}
    		var officers = json.value;
    		var data = [];
    		for (var i = 0 in officers){
    			var o = officers[i];
    			data.push({value:o.officerid,label:o.name})
    		}
    		my.officers = data;
    	}).fail(function(xhr){
			console.log(xhr.status + ';' + xhr.statusText);
			return false;
    	});
	};

	my.setFields = function(){
		var fields = [
		              {id : "workno", label : "Work No", "class" : "validate[required,custom[integer],min[1]]"}
		              ,{id : "worktypeid",label : "Type of O&M Work",type : "combobox",data : my.worktypes, "class" : "validate[required]"}
		              ,{id : "otherworkname", label : "Type of Work(3:Others)", "class" : "validate[maxSize[100]]"}
		              ,{id : "officerid", label : "Name of Officer", type : "combobox", data : my.officers, "class" : "validate[required]"}
		              ,{id : "inputdate", label : "Date",type : "date", "class" : "validate[required]"}
		              ,{id : "roadname", label : "Name of Road", "class" : "validate[required,maxSize[50]]"}
		              ,{id : "worklocation", label : "Location", "class" : "validate[required,maxSize[100]]"}
		              ,{
		            	  id : "lekagescale",
		            	  label : "Scale of Lekage",
		            	  type : "combobox",
		            	  "class" : "validate[required]",
		            	  data : [{value:'1',label:'1:Large'},{value:'2',label:'2:Medium'},
		            	          {value:'3',label:'3:Small'},{value:'-1',label:'-1:N/A'}]
		              }
		              ,{id : "dateofwork", label : "Date of Work",type : "date", "class" : "validate[required]"}
		              ,{id : "workersno", label : "No. of Workers", "class" : "validate[required,custom[integer],min[1],max[" + my.officers.length + "]]"}
		              ,{id : "timetaken", label : "Time Taken for Work(minutes)", "class" : "validate[required,custom[integer]]"}
		              ,{
		            	  id : "usedmaterial",
		            	  subid : "usedmaterialformatrix"
		              }
		              ,{
		            	  id : "pipe_material",
		            	  label : "Pipe Material",
		            	  type : "combobox",
		            	  "class" : "validate[required]",
		            	  data : [{value:'PVC',label:'1:PVC'},{value:'GIP',label:'2:GIP'},
		            	          {value:'PPR',label:'3:PPR'},{value:'HDPE',label:'4:HDPE'},
		            	          {value:'Others',label:'5:Others'}]
		              }
		              ,{
		            	  id : "pipe_diameter",
		            	  label : "Pipe Diameter(mm)",
		            	  type : "combobox",
		            	  skipValueWithLabel : true,
		            	  "class" : "validate[required]",
		            	  data : [{value:'13',label:'DN13(1/2 inch)'},{value:'20',label:'DN20(3/4 inch)'},
		            	          {value:'25',label:'DN25(1 inch)'},{value:'32',label:'DN32(1.25 inch)'},
		            	          {value:'38',label:'DN38(1.5 inch)'},{value:'50',label:'DN50(2 inch)'},
		            	          {value:'63',label:'DN63(2.5 inch)'},{value:'75',label:'DN75(3 inch)'},
		            	          {value:'100',label:'DN100(4 inch)'},{value:'150',label:'DN150(6 inch)'},
		            	          {value:'200',label:'DN200(8 inch)'},{value:'250',label:'DN250(10 inch)'}]
		              }
		              ,{id : "pipe_depth", label : "Pipe Depth(mm)", "class" : "validate[required,custom[integer],min[0],max[3000]]"}
		              ,{
		            	  id : "land_class",
		            	  label : "Landownership Classification",
		            	  type : "combobox",
		            	  "class" : "validate[required]",
		            	  data : [{value:'Public',label:'1:Public'},{value:'Private',label:'2:Private'}]
		              }
		              ,{id : "pipe_class",
		            	  label : "Pipe Classification",
		            	  type : "combobox",
		            	  "class" : "validate[required]",
		            	  data : [{value:'Distribution Pipe',label:'1:Distribution Pipe'},{value:'Service Pipe',label:'2:Service Pipe'},{value:'Transmission Pipe',label:'3:Transmission Pipe'}]
		              }
		              ,{
		            	  id : "surface",
		            	  label : "Surface",
		            	  type : "combobox",
		            	  "class" : "validate[required]",
		            	  data : [{value:'Asphalt',label:'1:Asphalt'},{value:'Concrete',label:'2:Concrete'},
		            	          {value:'Soil/Gravel',label:'3:Soil/Gravel'},{value:'Others',label:'4:Others'}]
		              }
		              ,{
		            	  id : "work_point",
		            	  label : "The Point of Works",
		            	  type : "combobox",
		            	  "class" : "validate[required]",
		            	  data : [{value:'Pipe Body',label:'1:Pipe Body'},{value:'Pipe Joint',label:'2:Pipe Joint'},
		            	          {value:'Valve',label:'3:Valve'},{value:'Fire Hydrant',label:'4:Fire Hydrant'},
		            	          {value:'Service Pipe',label:'5:Service Pipe'},{value:'Ferrule',label:'6:Ferrule'},
		            	          {value:'Water Meter',label:'7:Water Meter'},{value:'Others',label:'8:Others'}]
		              }
		              ,{id : "comments", label : "Comment", "class" : "validate[maxSize[500]]"}
		              ];
		my.fields = fields;
	};

	my.getDialogHtml = function(){
		var html = "<form id='form" + my.id + "' method='post'><table class='dialogstyle'>";
		for (var i = 0 in my.fields){
			var f = my.fields[i];
			if (f.id === 'usedmaterial'){
				html += "<tr><th colspan='2'><div id = '" + f.subid + "' style='width:100%'></div></td></tr>";
				my.objInputUsedMaterial = gis.ui.control.inputUsedMaterial({divid : f.subid});

			}else{
				html += "<tr><th style='width:40%'>" + f.label + "</th>";
				var insertHtml = "";
				if (f.type === 'combobox'){
					insertHtml = "<select id='" + f.id + "' style='width:100%' class='" + f["class"] + "'>";
					for (var i = 0 in f.data){
						if (i == 0){
							insertHtml += "<option value=''>Please choose from select</option>";
						}
						var d = f.data[i];
						insertHtml += "<option value='" + d.value + "'>" + d.label + "</option>";
					}
					insertHtml += "</select>";
				}else if (f.type === 'date'){
					insertHtml += "<input id='" + f.id + "' style='width:98%' class='" + f["class"] + "'/>";
				}else{
					if (!f["class"]){
						insertHtml += "<input id='" + f.id + "' type='text' style='width:98%'/>";
					}else{
						insertHtml += "<input id='" + f.id + "' type='text' style='width:98%' class='" + f["class"] + "'/>";
					}

				}
				html += "<td style='width:60%'>" + insertHtml + "</td>";
				html += "</tr>";
			}
		}
		html += "</table></form>"
		return html;
	};

	my.setDatePicker = function(){
		for (var i = 0 in my.fields){
			var f = my.fields[i];
			if (f.type === 'date'){
				$("#" + f.id).datepicker({
					dateFormat : 'dd/mm/yy'
				});
			}
		}
	}

	my.btnSave_onClick = function(){
		var valid = $("#form" + my.id).validationEngine('validate');
		if (valid !==true){
			return;
		}

		var usedmaterials = my.objInputUsedMaterial.getMatrixValues();
		if (usedmaterials.length === 0){
			if (!confirm("You don't input used materials yet. Do you want to cotinue saving?")){
				return;
			}
		}else{
			if (!confirm("Do you want to input this data into GIS database?")){
				return;
			}
		}

		var values = {};
		for (var i = 0 in my.fields){
			var f = my.fields[i];
			if (f.id === 'usedmaterial'){
				values[f.id] = JSON.stringify(usedmaterials);
			}else{
				values[f.id] = $("#" + f.id).val()
			}
		}
		values["geom"] = my.geometry.toString();

		$.ajax({
			url : './rest/Worksheets',
			type : 'POST',
			data : values,
			dataType : 'json',
			cache : false,
			async : false
    	}).done(function(json){
    		if (json.code !== 0){
    			alert(json.message);
    			return;
    		}
    		my.worksheetLayer.redraw();
    		my.dialog.close();
    	}).fail(function(xhr){
    		console.log(xhr.status + ';' + xhr.statusText);
			return;
    	});


	};

	/**
	 * フィーチャ選択時のイベント定義
	 */
	my.callbacks = {
            "beforefeatureadded": function(e) {
            	if (my.isInit === false){
            		return false;
            	}
            	if (!confirm("Are you sure here is really O&M point?")){
					return false;
				}
            	for (var i = 0 in my.fields){
        			if (my.fields[i].id === 'usedmaterial'){
        				my.objInputUsedMaterial.clear();
        			}else{
        				$("#" + my.fields[i].id).val("");
        			}
        		}
            	var f = e.feature;
            	my.geometry = e.feature.geometry;
            	my.dialog.open();
            	return false;
            }
	};

	/**
	 * コントロールがアクティブになった後の処理（オプション用）
	 */
	my.afterActivate = function(){
		gistools.objLogin.login(function(isSuccess){
			if (isSuccess === true){
				my.init();
				my.worksheetLayer.setVisibility(true);
				my.editingLayer.events.on(my.callbacks);
			}else{
				that.deactivate();
			}
		});
	};

	/**
	 * コントロールが非アクティブになった後の処理
	 */
	my.afterDeactivate = function(){
		my.editingLayer.events.un(my.callbacks);
	};

	that.CLASS_NAME =  "gis.ui.control.inputWorksheet";
	return that;
};
/* ======================================================================
    gis/ui/control/zoomBox.js
   ====================================================================== */

/**
 * 矩形から表示範囲を変更するコントロール
 */
gis.ui.control.zoomBox = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'zoombox';
	
	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || 'zoombox';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Zoom Box';
	
	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = new OpenLayers.Control.ZoomBox();
	
	/**
	 * 地図関係の編集コントロールかどうか
	 */
	my.isOlControl = true;
	
	that.CLASS_NAME =  "gis.ui.control.zoomBox";
	return that;
};
/* ======================================================================
    gis/ui/control/none.js
   ====================================================================== */

/**
 * 何もしないデフォルトのコントロール
 */
gis.ui.control.none = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'none';
	
	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || 'none';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Drag';
	
	/**
	 * デフォルトのチェック状態
	 */
	my.defaultchecked = true;
	
	/**
	 * 地図関係の編集コントロールかどうか
	 */
	my.isOlControl = true;
	
	that.CLASS_NAME =  "gis.ui.control.none";
	return that;
};
/* ======================================================================
    gis/setting.js
   ====================================================================== */

gis.setting = function(spec,my){
	var that= {};

	my = my || {};

	my.values = {};

	my.getFromServer = function(){
		$.ajax({
			url : './rest/Setting',
			type : 'GET',
			dataType : 'json',
			cache : false,
			async : false
    	}).done(function(json){
    		if (json.code !== 0){
    			alert(json.message);
    			return;
    		}
    		my.values = json.value;
    	}).fail(function(xhr){
			console.log(xhr.status + ';' + xhr.statusText);
			return false;
    	});
	}

	my.getValue = function(key){
		if (!my.values[key]){
			return null;
		}else{
			return my.values[key];
		}
	};

	that.init = function(){
		my.getFromServer();
	};

	that.getMapServUrl = function(){
		return my.getValue("MapServerUrl");
	}

	that.getBounds = function(name){
		var values = JSON.parse(my.getValue("bounds"));
		if (!values[name]){
			return null;
		}else{
			return new OpenLayers.Bounds(values[name]);
		}
	}

	that.CLASS_NAME =  "gis.setting";
	return that;
};
/* ======================================================================
    gis/ui/mapmenu.js
   ====================================================================== */

/**
 * 編集メニューを管理するクラス
 */
gis.ui.mapmenu = function(spec,my){
	my = my || {};

	var that = gis.ui(spec,my);

	/**
	 * メニューのID
	 */
	my.menuid = 'controlToggle';

	/**
	 * メニューの幅
	 */
	my.menuwidth = spec.width;

	/**
	 * OpenLayers.Mapオブジェクト
	 */
	my.map = spec.map;

	/**
	 * 編集用のOpenLayers.Layer.Vectorオブジェクト
	 */
	my.editingLayer = new OpenLayers.Layer.Vector( "Editable" );

	/**
	 * コントロールチェック時のコールバック関数
	 */
	my.toggleControl = function(element) {
		for (var i = 0 in my.ctrlObjArray){
        	var obj = my.ctrlObjArray[i];
        	obj.changeActivate(element);
        }
    },

    /**
	 * 地図編集コントロールの配列
	 */
	my.olcontrols = [],

    my.getMenuList = function(){
    	var selectmenu = {
				id : 'select',
            	 name : 'Select',
            	 items : [
            	          gis.ui.control.none({}),
            	          gis.ui.control.zoomBox({})
            	          //gis.ui.control.selectFeature({editingLayer : my.editingLayer})
            	          ]
		};

    	var worksheetmenu = {
				id : 'worksheet',
            	 name : 'O&M',
            	 items : [
            	          gis.ui.control.reportLeakage({map : my.map})
            	          ]
		};

    	var searchmenu = {
				id : 'search',
            	 name : 'Search',
            	 items : [
            	          //gis.ui.control.search.customerView({map : my.map}),
            	          gis.ui.control.zoomToExtent.kapsabet({map : my.map}),
            			  gis.ui.control.zoomToExtent.nandihill({map : my.map})
            	          ]
		};

    	var toolsmenu = {
				id : 'tools',
            	name : 'Tools',
            	items : [
            	         gis.ui.control.measure.calcDistance({}),
            	         gis.ui.control.measure.calcArea({}),
            	         gis.ui.control.graticule({map : my.map})
            	         ]
		};

    	/*var uploadmenu = {
            	id : 'upload',
            	name : 'Upload',
            	items : [
            	         gis.ui.control.uploadBillingData({})
            	         ]
            };

    	var downloadmenu = {
            	id : 'download',
            	name : 'Download',
            	items : [
            	         gis.ui.control.uncapturedMeter({})
            	         ]
            };*/

		return [selectmenu,worksheetmenu,searchmenu,toolsmenu/*,uploadmenu,downloadmenu*/];
    };

    my.createCallback = function(id){;
		for (var j = 0 in my.olcontrols){
			var temp = my.olcontrols[j];
			if (temp.getId() === id){
				temp.activate();
			}else{
				temp.deactivate();
			}
		}
    };

    /**
     * メニュー初期化
     */
	that.init = function(){
		my.map.addLayer(my.editingLayer);

		var menulist = my.getMenuList();
		var menuhtml = "";
		for (var i = 0 in menulist){
			var menu = menulist[i];
			menuhtml += "<li class='dropdown_item'>" ;
			menuhtml += "<a href='#' id='" + menu.id + "'>" + menu.name + "</a>" ;
			if (menu.items){
				var itemhtml = "";
				for (var j = 0 in menu.items){
					var item = menu.items[j];
					itemhtml += "<li>" ;
					itemhtml += item.createHtml() ;
					itemhtml += "</li>";
				}
				menuhtml += "<ul>" + itemhtml + "</ul>";
			}
			menuhtml += "</li>";
		}
		menuhtml = "<ul class='dropdown'>" + menuhtml + "</ul><div style='clear:both;'></div>";
		$("#" + my.divid).html(menuhtml);

		$('ul.dropdown li.dropdown_item').hover(
				function(){
					$(this).find('ul').slideDown(200);
				},
				function(){
					$(this).find('ul').hide();
				}
			);
		$("#" + my.divid).addClass('ui-widget-content ui-corner-all');
		$('li.dropdown_item > ul').addClass('ui-widget-content ui-corner-all');
		$('li.dropdown_item > ul').hide();

		my.olcontrols = [];
		for (var i = 0 in menulist){
			for (var j = 0 in menulist[i].items){
				var item = menulist[i].items[j];
				if (!item.isOlControl()){
					continue;
				}
				my.olcontrols.push(item);
			}
		}

		for (var i = 0 in my.olcontrols){
			var ctrl = my.olcontrols[i];
			ctrl.addControlInMap(gistools.map);
			$("#" + ctrl.getId()).click(function(obj){
				my.createCallback(obj.target.id);
			});
		}

		for (var i = 0 in menulist){
			for (var j = 0 in menulist[i].items){
				var item = menulist[i].items[j];
				if (!item.isOlControl()){
					$("#" + item.getId()).click(item.execute);
				}
			}
		}
	};

	/**
	 * 地図編集メニューをすべて非アクティブにする
	 */
	that.allDeactivate = function(){
		for (var i = 0 in my.olcontrols){
			var ctrl = my.olcontrols[i];
			ctrl.deactivate();
		}
	};


	that.CLASS_NAME =  "gis.ui.mapmenu";
	return that;
};
/* ======================================================================
    gis/ui/control/graticule.js
   ====================================================================== */

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
/* ======================================================================
    gis/ui/control/uncapturedMeter.js
   ====================================================================== */

/**
 * The tool for downloading a list of uncaptured meter by GPS
 */
gis.ui.control.uncapturedMeter = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'uncapturedMeter';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'List of Uncaptured Meters';

	my.zones = [{value:"A", display:"A(Narok)"},{value:"B", display:"B(Narok)"},{value:"C", display:"C(Ololulunga)"},{value:"D", display:"D(Kilgoris)"}];

	my.dialog = gis.ui.dialog({ divid : my.id });

	/**
	 * コンストラクタ
	 */
	my.init = function(){
		var html = my.getHtml();
		my.dialog.create(html,{
			title : 'List of Uncaptured Meters',
			modal : true,
			position : 'center',
			buttons : {
				'Download' : function(){
					my.download();
				},
				'Close' : function(){
					$(this).dialog('close');
				}
			}
		});
	};

	my.getHtml = function(){
		var html = "";
		for (var i = i in my.zones){
			var zone = my.zones[i];
			html += "<input type='checkbox' name='zone' value='" + zone.value + "' checked>" + zone.display + "<br>"
		}
		return html;
	};

	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		my.init();
		gistools.objLogin.login(function(isSuccess){
			if (isSuccess === true){
				my.dialog.open();
			}
		});
	};

	my.download = function(){
		var zones = [];
		$('[name="zone"]:checked').each(function(){
			zones.push($(this).val());
		});
		if (zones.length === 0){
			alert("Check a zone at least.");
			return;
		}
		$.ajax({
			url : './rest/Meters/Uncaptured?zonecd=' + JSON.stringify(zones),
			type : 'GET',
			dataType : 'json',
			cache : false,
			async : false
    	}).done(function(json){
    		if (json.code !== 0){
    			alert(json.message);
    			return;
    		}

    		window.open(json.value);
    		my.dialog.close();
    	}).fail(function(xhr){
			console.log(xhr.status + ';' + xhr.statusText);
			return;
    	});
	};

	that.CLASS_NAME =  "gis.ui.control.uncapturedMeter";
	return that;
};
/* ======================================================================
    gis/geometryOp/polygonOp.js
   ====================================================================== */

gis.geometryOp.polygonOp = function(spec,my){
	my = my || {};

	var that = gis.geometryOp(spec,my);

	/**
	 * ポリゴンを指定ラインが貫いているかチェックする
	 * @param line OpenLayers.Geometry.LineString
	 * @returns {Boolean}
	 */
	that.overlapbdyDisjoint = function(line){
		//ラインがポリゴンと交差しているか
    	var vertices = line.getVertices();
        var intersects = my.geometry.intersects(line);
        if (intersects === true){
        	//ラインの端点がポリゴンの外にあるか
        	if (my.geometry.intersects(vertices[0]) || my.geometry.intersects(vertices[vertices.length-1])) {
                intersects = false;
            }
        }
        return intersects;
	};
	
	/**
	 * ポリゴンをマルチラインストリングに変換する
	 */
	that.toMultiLineString = function(){
		var lines = [];
		for (var iRing = 0 in my.geometry.components){
			var ring = my.geometry.components[iRing];
			for (var iPoint = 0 ; iPoint < ring.components.length -1;iPoint++){
				var from = ring.components[iPoint];
				var to = ring.components[iPoint + 1];
				
				var line = new OpenLayers.Geometry.LineString([from,to]);
				lines.push(line);
			}
		}
		return new OpenLayers.Geometry.MultiLineString(lines);
	};
	
	that.CLASS_NAME =  "gis.geometryOp.polygonOp";
	return that;
};
/* ======================================================================
    gis/ui/control/uploadBillingData.js
   ====================================================================== */

/**
 * The tool for downloading a list of uncaptured meter by GPS
 */
gis.ui.control.uploadBillingData = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'uploadBillingData';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Upload Billing Data';

	my.dialog = gis.ui.dialog({ divid : my.id });

	/**
	 * コンストラクタ
	 */
	my.init = function(){
		var html = my.getHtml();
		my.dialog.create(html,{
			title : 'Upload Billing Data',
			width : 400,
			modal : true,
			position : 'center',
			buttons : {
				'Upload' : function(){
					my.upload();
				},
				'Close' : function(){
					$(this).dialog('close');
				}
			}
		},function(){
			var now = new Date();
			var nowYear = now.getFullYear();
			var nowMonth = now.getMonth() + 1;
			$("#" + my.id + "-year").val(nowYear);
			$("#" + my.id + "-month").val(nowMonth);
		});
	};

	my.getHtml = function(){
		var now = new Date();
		var nowYear = now.getFullYear();

		var inserthtml = "<select id='" + my.id + "-month' style='width:40%'>";
		for (var i = 1; i <= 12; i++){
			inserthtml += "<option value='" + i + "'>" + i + "</option>";
		}
		inserthtml += "</select>";

		inserthtml += "<select id='" + my.id + "-year' style='width:60%'>";
		for (var i = nowYear; i > nowYear - 5; i--){
			inserthtml += "<option value='" + i + "'>" + i + "</option>";
		}
		inserthtml += "</select>";

		var html = "<table class='dialogstyle' style='width:100%'>" +
		"<tr><td>Month/Year</td><td>" + inserthtml + "</td></tr>" +
		"<tr><td colspan='2'><input type='file' id='" + my.id + "-file' style='width:100%'></td></tr>";

		return html;
	};

	my.upload = function(){
		var year = $("#" + my.id + "-year").val();
		var month = $("#" + my.id + "-month").val();
		var file = $("#" + my.id + "-file").val();

		if (file === ""){
			alert("Choose a csv file from Billing System which you want to upload.");
			return;
		}
		var fileobj = $("#" + my.id + "-file").prop('files')[0];
		var filename = fileobj.name;

		if (!confirm("Would you like to upload " + filename + " of " + month + " / " + year + " ?")){
			return;
		}

		var form = new FormData();
		form.append("file",fileobj);
		form.append("yearmonth",year + ("0" + month).slice(-2));

		$.ajax({
			url : './rest/BillingSync',
			data : form,
			type : 'POST',
			dataType : 'json',
			contentType : false,
			processData : false,
			cache : false,
			async : false
    	}).done(function(json){
    		if (json.code !== 0){
    			alert(json.message);
    			return;
    		}

    		alert("It succeeded to insert " + json.value + " records.");

    		my.dialog.close();
    	}).fail(function(xhr){
			console.log(xhr.status + ';' + xhr.statusText);
			return;
    	});
	};

	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		my.init();
		gistools.objLogin.login(function(isSuccess){
			if (isSuccess === true){
				my.dialog.open();
			}
		});
	};

	that.CLASS_NAME =  "gis.ui.control.uploadBillingData";
	return that;
};
/* ======================================================================
    gis/ui/control/selectFeature.js
   ====================================================================== */

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
/* ======================================================================
    gis/ui/control/login.js
   ====================================================================== */

/**
 * WKTを編集レイヤに表示するコントロール
 */
gis.ui.control.login = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'login';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Login';

	my.dialog = gis.ui.dialog({ divid : my.id });

	my.isSuccess = false;

	my.isInit = false;

	my.successCallback = null;

	/**
	 * コンストラクタ
	 */
	my.init = function(){
		if (my.isInit === true){
			return;
		}

		var html = my.getDialogHtml();
		my.dialog.create(html,{
			title : 'Login',
			modal : true,
			position : 'center',
			buttons : {
				'Login' : my.btnLogin_onClick,
				'Cancel' : function(){
					my.dialog.close();
					my.successCallback(my.isSuccess);
				}
			}
		});
		$("#form" + my.id).validationEngine('attach',{
			promptPosition:"inline"
		});
		my.isInit = true;
	};

	my.getDialogHtml = function(){
		var fields = [
		              {id : "password", label : "Password", type : "password", "class" : "validate[required]"}
		              ];

		var html = "<form id='form" + my.id + "' method='post'><table class='dialogstyle'>";
		for (var i = 0 in fields){
			var f = fields[i];
			html += "<tr><th style='width:40%'>" + f.label + "</th>";
			var option = "";
			if (f["class"]){
				option = "class='" + f["class"] + "'";
			}
			var insertHtml = "<input id='" + f.id + "' type='" + f.type + "' style='width:98%' " + option + "/>";
			html += "<td style='width:60%'>" + insertHtml + "</td>";
			html += "</tr>";
		}
		html += "</table></form>"
		return html;
	};

	my.loginToServer = function(){
		$.ajax({
			url : './rest/Login?Password=' + $("#password").val(),
			type : 'GET',
			dataType : 'json',
			cache : false,
			async : false
    	}).done(function(json){
    		if (json.code !== 0){
    			alert(json.message);
    			return;
    		}
    		my.isSuccess = json.value;
    		if (my.isSuccess === false){
    			alert("Password is wrong. Please confirm password.");
    			$("#password").val("");
    			return;
    		}
    		my.successCallback(my.isSuccess);
    		my.dialog.close();
    	}).fail(function(xhr){
			console.log(xhr.status + ';' + xhr.statusText);
			return false;
    	});
	}

	my.btnLogin_onClick = function(){
		var valid = $("#form" + my.id).validationEngine('validate');
		if (valid !==true){
			return;
		}
		my.loginToServer();
	};

	that.login = function(successCallback){
		if (my.isSuccess === true){
			my.successCallback = successCallback;
			my.successCallback(my.isSuccess);
			return;
		}

		my.init();
		my.dialog.open();
		my.successCallback = successCallback;
	}

	that.CLASS_NAME =  "gis.ui.control.zoomToVillage";
	return that;
};
/* ======================================================================
    gis/geometryOp/pointOp.js
   ====================================================================== */

gis.geometryOp.pointOp = function(spec,my){
	my = my || {};

	var that = gis.geometryOp(spec,my);
	
	/**
	 * 座標精度を指定精度で切り捨てる
	 * @param precision 小数点第何位
	 * @returns {OpenLayers.Geometry.Point}
	 */
	that.floor = function(precision){
		if (!precision){
    		precision = 8;
    	}
    	var __pre = Math.pow(10,precision);
    	var x = my.geometry.x * __pre;
    	var y = my.geometry.y * __pre;
    	
    	my.geometry.x = Math.round(x) / __pre;
    	my.geometry.y = Math.round(y) / __pre;
    	return my.geometry;
	};
	
	that.CLASS_NAME =  "gis.geometryOp.pointOp";
	return that;
};
/* ======================================================================
    gis/ui/control/selectWorksheet.js
   ====================================================================== */

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
/* ======================================================================
    gis/ui/statusbar.js
   ====================================================================== */


gis.ui.statusbar = function(spec,my){
	my = my || {};

	var that = gis.ui(spec,my);
	
	/**
	 * メニューのID
	 */
	my.menuid = 'controlToggle';
	
	/**
	 * OpenLayers.Mapオブジェクト
	 */
	my.map = spec.map;

	my.olcontrols = [],
    
    /**
     * メニュー初期化
     */
	that.init = function(){
		var controls = [
						gis.ui.control.mousePosition({map : my.map}),
						gis.ui.control.scaleView({map : my.map})
		                ];
		
        var contentid = "statuscontents";
        var html = "<table><tr id='" + contentid + "'></tr></table>";
        $("#" + my.divid).append(html);
        
        for (var i = 0 in controls){
        	var ctrl = controls[i];
        	ctrl.initforStatus(contentid);
        }
	};
	
	
	
	that.CLASS_NAME =  "gis.ui.statusbar";
	return that;
};
/* ======================================================================
    gis/ui/control/snapping.js
   ====================================================================== */

/**
 * スナッピングツール
 */
gis.ui.control.snapping = function(spec, my) {
	my = my || {};

	var that = gis.ui.control(spec, my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'snapping';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Snapping Setting';

	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = new OpenLayers.Control.Snapping({
		layer: my.editingLayer,
		targets: [my.editingLayer],
        greedy: false
	});
	
	my.dialog = gis.ui.dialog({ divid : my.id });
	
	/**
	 * コンストラクタ
	 */
	my.init = function(){
		var html = my.getHtml();
		my.dialog.create(html,{
			title : 'Snapping Option',
			close : function(){
				my.olControl.deactivate();
			}
		},my.initUI);
	};
	
	my.getHtml = function(){
		var types = ["node", "vertex", "edge"];
		var typenms = ["node","vertex","edge"];
		
		var html = "<table>";
		for (var i = 0 in types){
			var type = types[i];
			var name = typenms[i];
			var id = my.id + "_" + type;
			html += "<tr>" +
			"<td><input type='checkbox' id='" + id + "'/></td>" +
			"<td><label for='" + id + "'>" + name + "</label>" +
			"<td><input type='number' id='" + id + "Tolerance' class='gis-ui-control-snapping-txtnumber'/></td>" +
			"<td><label for='" + id + "'>px</label></td>" +
			"</tr>";
		}
		html += "</table>";
		return html;
	};
	
	/**
	 * UI設定コントロールの初期化
	 */
	my.initUI = function(){
		that.addControlInMap(my.map);
		
		var types = ["node", "vertex", "edge"];
		for (var i = 0 in my.olControl.targets){
			var target = my.olControl.targets[i];
			for (var j = 0 in types){
				var type = types[j];
				var tog = document.getElementById(my.id + "_" + type);
                tog.checked = target[type];
                tog.onclick = (function(tog, type, target) {
                    return function() {target[type] = tog.checked;};
                })(tog, type, target);
                tol = document.getElementById(my.id + "_" + type + "Tolerance");
                tol.value = target[type + "Tolerance"];
                tol.onchange = (function(tol, type, target) {
                    return function() {
                        target[type + "Tolerance"] = Number(tol.value) || 0;
                    };
                })(tol, type, target);
			};
		};
	};
	
	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		my.init();
		if (!my.editingLayer){
			return;
		}
		my.olControl.activate();
		my.dialog.open();

	};
	
	that.CLASS_NAME = "gis.ui.control.snapping";
	return that;
};
/* ======================================================================
    gis/ui/control/scaleView.js
   ====================================================================== */

/**
 * 縮尺を取得するコントロール
 */
gis.ui.control.scaleView = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'scaleView';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'View Scale Bar';

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

	/**
	 * 縮尺変更時のコールバック関数
	 */
	my.scale_changed = function(e){
		$("#" + my.id + "_scale").val(parseInt(my.map.getScale()));
	};

	my.dialog = gis.ui.dialog({ divid : my.id });

	/**
	 * コンストラクタ
	 */
	my.init = function(){
		var html = my.getHtml();
		my.dialog.create(html,{
			title : my.label,
			close : function(){
				my.map.events.unregister("zoomend", my.map, my.scale_changed);
			}
		});
	};

	my.getHtml = function(){
		var html = "<table>" +
		"<tr>" +
				"<td><label class='gis-ui-control-viewscale-label'>Scale</label></td>" +
				"<td><input type='text' class='gis-ui-control-viewscale-txt' id='" + my.id + "_scale'/></td>" +
		"</tr>" +
		"</table>";
		return html;
	};

	my.getHtmlforStatus = function(){
		var html = "" +
				"<td><label class='gis-ui-control-viewscale-label'>Scale</label></td>" +
				"<td><input type='text' class='gis-ui-control-viewscale-txt' id='" + my.id + "_scale' readonly/></td>";
		return html;
	};

	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		my.init();
		my.map.events.register("zoomend", my.map, my.scale_changed);
		my.scale_changed();
		my.dialog.open();
	};

	that.initforStatus = function(divid){
		var html = my.getHtmlforStatus();
		$("#" + divid).append(html);
		my.map.events.register("zoomend", my.map, my.scale_changed);
	};

	that.CLASS_NAME =  "gis.ui.control.scaleView";
	return that;
};
/* ======================================================================
    gis/ui/control/printMap.js
   ====================================================================== */

gis.ui.control.printMap = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'printMap';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Print Map';

	/**
	 * OpenLayers.Mapオブジェクト
	 */
	my.map = spec.map;

	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		var e = my.map.getExtent().toBBOX();
		$.ajax({
			url : './rest/MapPdf/A4?bbox=' + e,
			type : 'GET',
			dataType : 'json',
			cache : false,
			async : false
    	}).done(function(json){
    		if (json.code !== 0){
    			alert(json.message);
    			return;
    		}

    		window.open(json.value);
    	}).fail(function(xhr){
			console.log(xhr.status + ';' + xhr.statusText);
			return;
    	});
	};

	that.CLASS_NAME =  "gis.ui.control.printMap";
	return that;
};
/* ======================================================================
    gis/ui/control/reportLeakage.js
   ====================================================================== */

gis.ui.control.reportLeakage = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'reportLeakage';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'O&M Worksheet';

	/**
	 * OpenLayers.Mapオブジェクト
	 */
	my.map = spec.map;

	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		var e = my.map.getExtent().toBBOX();
		$.ajax({
			url : './rest/MapPdf/OM?bbox=' + e,
			type : 'GET',
			dataType : 'json',
			cache : false,
			async : false
    	}).done(function(json){
    		if (json.code !== 0){
    			alert(json.message);
    			return;
    		}

    		window.open(json.value);
    	}).fail(function(xhr){
			console.log(xhr.status + ';' + xhr.statusText);
			return;
    	});
	};

	that.CLASS_NAME =  "gis.ui.control.reportLeakage";
	return that;
};
/* ======================================================================
    gis/ui/control/search.js
   ====================================================================== */

/**
 * WKTを編集レイヤに表示するコントロール
 */
gis.ui.control.search = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'search';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Search Data';

	my.dialog = gis.ui.dialog({ divid : my.id });

	my.tableId = "table-" + my.id;
	my.pagerId = "pager-" + my.id;

	my.selectedRow = null;

	//my.height = 510;
	//my.width = 940;
	//my.url = '';
	//my.colModelSettings= [];
	//my.colNames = [];

	/**
	 * コンストラクタ
	 */
	my.init = function(){
		var html = my.getHtml();
		my.dialog.create(html,{
			title : my.label,
			modal : true,
			height : my.height,
			width : my.width,
			position : 'center',
			buttons : {
				'View' : my.btnView_onClick,
				'Close' : function(){
					$(this).dialog('close');
				}
			}
		},my.getData);
	};

	my.getData = function(){
		$.ajax({
			url : my.url,
			type : 'GET',
			dataType : 'json',
			cache : false,
			async : false
    	}).done(function(json){
    		if (json.code !== 0){
    			alert(json.message);
    			return;
    		}
    		//テーブルの作成
           $("#" + my.tableId).jqGrid({
	           data:json.value, //表示したいデータ
	           datatype : "local", //データの種別 他にjsonやxmlも選べます。
	           //しかし、私はlocalが推奨です。
	           colNames : my.colNames, //列の表示名
	           colModel : my.colModelSettings, //列ごとの設定
	           rowNum : 10, //一ページに表示する行数
	           height : 270, //高さ
	           width : 910, //幅
	           pager : my.pagerId, //footerのページャー要素のid
	           viewrecords: true //footerの右下に表示する。
	           });
           $("#" + my.tableId).jqGrid('navGrid','#' + my.pagerId,{
        	   add:false, //おまじない
        	   edit:false, //おまじない
        	   del:false, //おまじない
        	   search:{ //検索オプション
        	   odata : ['equal', 'not equal', 'less', 'less or equal',
        	   'greater','greater or equal', 'begins with',
        	   'does not begin with','is in','is not in','ends with',
        	   'does not end with','contains','does not contain']
        	   } //検索の一致条件を入れられる
        	   });
         //filterバー追加
           $("#" + my.tableId).filterToolbar({
           defaultSearch:'cn' //一致条件を入れる。
           //選択肢['eq','ne','lt','le','gt','ge','bw','bn','in','ni','ew','en','cn','nc']
           });
    	}).fail(function(xhr){
			console.log(xhr.status + ';' + xhr.statusText);
			return false;
    	});
	};

	my.getHtml = function(){
		var html = "<table id='" + my.tableId + "'></table><div id = '" + my.pagerId + "'></div>";
		return html;
	};

	my.btnView_onClick = function(){
		var selrows = $("#" + my.tableId).getGridParam('selrow');
		if (selrows.length === 0 || selrows.length > 1){
			alert("Please select a record.");
			return;
		}
		var row = $("#" + my.tableId).getRowData(selrows[0]);
		if (row.wkt === ''){
			alert("Your selected record is not yet captured by GPS.")
			return;
		}
		var geom = OpenLayers.Geometry.fromWKT(row.wkt);
		my.map.setCenter(new OpenLayers.LonLat(geom.x,geom.y));
		my.map.zoomTo(10);
		my.dialog.close()
	};

	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		my.init();
		my.dialog.open();

	};

	that.CLASS_NAME =  "gis.ui.control.search";
	return that;
};
/* ======================================================================
    gis/ui/control/mousePosition.js
   ====================================================================== */

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
/* ======================================================================
    gis/ui/layer.js
   ====================================================================== */

/**
 * uiコントロールの最上位クラス
 */
gis.ui.layer = function(spec,my){
	var that= {};

	my = my || {};

	my.map = spec.map;
	my.defineurl = spec.defineurl;
	my.mapservurl = spec.mapservurl;

	that.init = function(){
		$.ajax({
			url : my.defineurl,
			type : 'GET',
			dataType : 'json',
			cache : false,
			async : false
		}).done(function(layers) {
			var layerarray = [];
			for (var i = 0 in layers){
				var layer = layers[i];
				var isBaseLayer = layer.isBaseLayer;
				var transparent = false;
				if (layer.isBaseLayer !== true){
					isBaseLayer = false;
					transparent = true;
				}
				var visible = layer.visible;
				if (layer.visible !== false){
					visible = true;
				}
				var obj = null;
				if (layer.type === "WMS"){
					obj = new OpenLayers.Layer.WMS(
							layer.name,
							my.mapservurl + 'map=' + layer.file,
							{
								layers: layer.layers,
								srs:"EPSG:4326",
								format:'image/png',
								transparent : transparent
							},
							{
								isBaseLayer : isBaseLayer,
								singleTile: true
							});
				} else if (layer.type === "WFS"){
					var vector_style_map = new OpenLayers.StyleMap();
					if (layer['rules']){
						var fieldname = layer.rules["fieldname"];
						var stylerules = layer.rules["styles"];
						var rules = [];
						for (var j in stylerules){
							rules.push(new OpenLayers.Rule({
			                    // a rule contains an optional filter
			                    filter: new OpenLayers.Filter.Comparison({
			                        type: OpenLayers.Filter.Comparison.LIKE,
			                        property: fieldname, // the "foo" feature attribute
			                        value: j
			                    }),
			                    // if a feature matches the above filter, use this symbolizer
			                    symbolizer: stylerules[j]
			                }));
						}
						var vector_style = new OpenLayers.Style();
						vector_style.addRules(rules);
		                //Create a style map object
		                vector_style_map = new OpenLayers.StyleMap({
		                    'default' : vector_style
		                });
					}

					obj = new OpenLayers.Layer.Vector(layer.name,{
						styleMap : vector_style_map,
						strategies: [new OpenLayers.Strategy.BBOX()],
						 protocol: new OpenLayers.Protocol.WFS({
		                      "url": my.mapservurl + 'map=' + layer.file,
		                      "featureType": layer.layers
		                  })
					});
				}else{
					continue;
				}
				obj.setVisibility(visible);
				layerarray.push(obj);
			}
			my.map.addLayers(layerarray);
		});
	};

	that.CLASS_NAME =  "gis.ui.layer";
	return that;
};
/* ======================================================================
    gis/ui/buttonmenu.js
   ====================================================================== */

gis.ui.buttonmenu = function(spec,my){
	my = my || {};

	var that = gis.ui(spec,my);

	/**
	 * メニューのID
	 */
	my.menuid = 'buttonMenuToggle';

	/**
	 * OpenLayers.Mapオブジェクト
	 */
	my.map = spec.map;

	my.getMenuList = function(){
		var menulist =
			[
			 gis.ui.control.reportLeakage({map : my.map}),
			 gis.ui.control.printMap({map : my.map}),
			 gis.ui.control.zoomToExtent.kapsabet({map : my.map}),
			 gis.ui.control.zoomToExtent.nandihill({map : my.map})
			 ];
		return menulist;
	};

    /**
     * メニュー初期化
     */
	that.init = function(){
		var menulist = my.getMenuList();
		var html = "";
		for (var i = 0 in menulist){
			var menu = menulist[i];
			html += "<td>" + menu.createButtonHtml() + "</td>";
		};
		html = "<table><tr>" + html + "</tr></table>";
		$("#" + my.divid).html(html);

		for (var i = 0 in menulist){
			var item = menulist[i];
			$("#" + item.getId()).click(item.execute)
		};
	};

	that.CLASS_NAME =  "gis.ui.buttonmenu";
	return that;
};
/* ======================================================================
    gis/ui/control/inputUsedMaterial.js
   ====================================================================== */

gis.ui.control.inputUsedMaterial = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'inputUsedMaterial';

	my.dialog = gis.ui.dialog({ divid : my.id });

	my.unitValues = [{label : 'No.', value:'No.'}];

	my.label = "Material(s) Userd for Work";
	my.header = ["No.","Item Description","Unit","Quantity","Remarks","Edit","Delete"];
	my.columnid = ["seqno","description","unit","quantity","remarks","edit","delete"];
	my.classes = ["","validate[required,max[100]","validate[required]","validate[required,custom[integer]]","validate[max[200]","",""];
	my.width = ['10%','25%','15%','20%','20%',"10%","10%"];
	my.inputtypes = ['text','text','combobox','text','text','button','button'];
	my.comboData = [,,my.unitValues,,,,];
	my.isseq = [true,false,false,false,false];
	my.dialogvisible = [true,true,true,true,true,false,false];

	my.btnAddId = my.id + 'AddRow';

	my.fieldValues = [];

	my.isInit = false;

	my.getDialogHtml = function(){
		var html = "<form id='subform" + my.id + "' method='post'><table class='dialogstyle'>";
		for (var i = 0 in my.header){
			if (my.dialogvisible[i] === false){
				continue;
			}
			html += "<tr><th style='width:40%'>" + my.header[i] + "</th>";
			var option = ""
			if (my.isseq[i] === true){
				option += "readonly";
			}
			var insertHtml = "";
			if (my.inputtypes[i] === 'combobox'){
				insertHtml = "<select id='" + my.columnid[i] + "' style='width:100%' class='" + my.classes[i] + "'>";
				var data = my.comboData[i];
				for (var j = 0 in data){
					if (j == 0){
						insertHtml += "<option value=''>Please choose from select</option>";
					}
					insertHtml += "<option value='" + data[j].value + "'>" + data[j].label + "</option>";
				}
				insertHtml += "</select>";
			}else{
				insertHtml = "<input id='" + my.columnid[i] + "' type='" + my.inputtypes[i] + "' style='width:98%' class='" + my.classes[i] + "' " + option + "/>";
			}
			html += "<td style='width:60%'>" + insertHtml + "</td>";
			html += "</tr>";
		}
		html += "</table></form>";
		return html;
	};

	my.btnAdd_onClick = function(){
		if (my.isInit === false){
			my.dialog.create(my.getDialogHtml(),{
				title : 'Input Used Material',
				modal : true,
				position : 'center',
				width : 400,
				buttons : {
					'Update' : my.btnAddMaterial_onClick,
					'Close' : function(){
						$(this).dialog('close');
					}
				}
			});
			$("#subform" + my.id).validationEngine('attach',{
				promptPosition:"inline"
			});
			my.isInit = true;
		};
		for (var i = 0 in my.columnid){
			$("#" + my.columnid[i]).val("");
		}
		$("#" + my.columnid[0]).val(my.fieldValues.length + 1);

		my.dialog.open();

	};

	my.btnAddMaterial_onClick = function(){
		var valid = $("#subform" + my.id).validationEngine('validate');
		if (valid !==true){
			return;
		}
		var currentRowId = $("#seqno").val()
		if (currentRowId > my.fieldValues.length){
			//add
			var values = [];
			for (var i = 0 in my.columnid){
				var fid = my.columnid[i];
				values.push({id:fid,value:$("#" + fid).val()});
			}
			my.fieldValues.push(values);
		}else{
			//update
			var values = my.fieldValues[currentRowId - 1];
			for (var i = 0 in my.columnid){
				var fid = my.columnid[i];
				values[i].id = fid;
				values[i].value = $("#" + fid).val();
			}
		}

		that.makeMatrix();
		my.dialog.close();
	};

	my.btnEditMaterial_onClick = function(e){
		var rowid = $("#" + e.target.id).val();
		var values = my.fieldValues[rowid];
		for (var i = 0 in values){
			var id = values[i].id;
			var val = values[i].value;
			$("#" + id).val(val)
		}
		my.dialog.open();
	};

	my.btnDeleteMaterial_onClick = function(e){
		var rowid = $("#" + e.target.id).val();
		my.fieldValues.splice(rowid,1);
		for (var i = 0 in my.fieldValues){
			var values = my.fieldValues[i];
			for (var j = 0 in values){
				if (values[j].id === 'seqno'){
					values[j].value = Number(i) + 1;
				}
			}
		}
		that.makeMatrix();
	};

	that.makeMatrix = function(){
		var html = "<table class='dialogstyle' style='width:100%'>";
		html += "<tr><th colspan='" + my.header.length + "'><label>" + my.label + "</label><button id='" + my.btnAddId + "'>Add</button></th></tr>";
		html += "<tr>";
		for (var i = 0 in my.header){
			html += "<th style='width:" + my.width[i] + "'>" + my.header[i] + "</th>";
		}
		html += "</tr>";

		for (var i = 0 in my.fieldValues){
			html += "<tr>";
			var values = my.fieldValues[i];
			for (var j = 0 in values){
				var val = values[j].value;
				if (my.inputtypes[j] === 'button'){
					html += "<td><button id='" + my.columnid[j] + i + "' value='" + i + "'>...</button></td>";
				}else{
					html += "<td>" + val + "</td>";
				}
			}
			html += "</tr>";
		}
		html += "</table>";
		$("#" + my.divid).html(html);
		$("#" + my.btnAddId).click(my.btnAdd_onClick);
		for (var i = 0 in my.fieldValues){
			var values = my.fieldValues[i];
			for (var j = 0 in values){
				var id = my.columnid[j] + i;
				if (my.columnid[j] === 'edit'){
					$("#" + id).click(my.btnEditMaterial_onClick);
				}else if (my.columnid[j] === 'delete'){
					$("#" + id).click(my.btnDeleteMaterial_onClick);
				}
			}
		}
	};

	that.getMatrixValues = function(){
		var resValues = [];
		for (var i = 0 in my.fieldValues){
			var resVal = {};
			var values = my.fieldValues[i];
			for (var j = 0 in values){
				var id = values[j].id;
				if (id === 'edit'){
					continue;
				}else if (id === 'delete'){
					continue;
				}
				resVal[id] = values[j].value;
			}
			resValues.push(resVal);
		}
		return resValues;
	}

	that.clear = function(){
		my.fieldValues = [];
		for (var i = 0 in my.columnid){
			$("#" + my.columnid[i]).val("");
		}
		that.makeMatrix();
	}

	that.CLASS_NAME =  "gis.ui.control.inputUsedMaterial";
	return that;
};
/* ======================================================================
    gis/ui/dialog.js
   ====================================================================== */

gis.ui.dialog = function(spec,my){
	my = my || {};

	var that = gis.ui(spec,my);

	my.divid = spec.divid;

	my.dialogId = spec.divid + '-dialog';

	my.isInit = false;

	/**
	 * Dialogを格納するdivを作成しHTMLをセットする
	 * @param html ダイアログのHTML
	 * @param option jquery-ui-dialogのオプション
	 */
	that.create = function(html,option,callback){
		if (my.isInit === true){
			return;
		}

		$(document.body).append("<div id='" + my.dialogId + "'></div>");
		$("#" + my.dialogId).html(html);

		if (!option){
			option = {};
		}
		if (!option.autoOpen){
			option.autoOpen = false;
		}
		if (!option.modal){
			option.modal = false;
		}
		if (!option.position){
			option.position = [0,0];
		}
		$("#" + my.dialogId).dialog(option);

		if (callback){
			callback();
		}

		my.isInit = true;
	};

	/**
	 * ダイアログを開く
	 */
	that.open = function(){
		$("#" + my.dialogId).dialog('open');
	};

	/**
	 * ダイアログを閉じる
	 */
	that.close = function(){
		$("#" + my.dialogId).dialog('close');
	};

	that.CLASS_NAME =  "gis.ui.dialog";
	return that;
};
/* ======================================================================
    gis/ui/control/measure.js
   ====================================================================== */

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
/* ======================================================================
    gis/ui/control/measure/calcArea.js
   ====================================================================== */

/**
 * 面積計算を行うコントロール
 */
gis.ui.control.measure.calcArea = function(spec,my){
	my = my || {};

	var that = gis.ui.control.measure(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'calcArea';
	
	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || 'calcArea';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Measure Area';
	
	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = new OpenLayers.Control.Measure(
            OpenLayers.Handler.Polygon, {
                persist: true,
                handlerOptions: {
                    layerOptions: {
                        renderers: my.getRendrer(),
                        styleMap: my.getStyleMap()
                    }
                }
            }
        );
	
	that.CLASS_NAME =  "gis.ui.control.measure.calcArea";
	return that;
};
/* ======================================================================
    gis/ui/control/measure/calcDistance.js
   ====================================================================== */

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
/* ======================================================================
    gis/ui/control/zoomToExtent/kapsabet.js
   ====================================================================== */

gis.ui.control.zoomToExtent.kapsabet = function(spec,my){
	my = my || {};

	var that = gis.ui.control.zoomToExtent(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'zoomToKapsabet';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Zoom To Kapsabet';

	my.bounds = gistools.settingObj.getBounds("Kapsabet");

	that.CLASS_NAME =  "gis.ui.control.zoomToExtent.kapsabet";
	return that;
};
/* ======================================================================
    gis/ui/control/zoomToExtent/nandihill.js
   ====================================================================== */

gis.ui.control.zoomToExtent.nandihill = function(spec,my){
	my = my || {};

	var that = gis.ui.control.zoomToExtent(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'zoomToNandiHill';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Zoom To Nandi Hill';

	my.bounds = gistools.settingObj.getBounds("NandiHill");

	that.CLASS_NAME =  "gis.ui.control.zoomToExtent.nandihill";
	return that;
};
/* ======================================================================
    gis/ui/control/search/customerView.js
   ====================================================================== */

/**
 * WKTを編集レイヤに表示するコントロール
 */
gis.ui.control.search.customerView = function(spec,my){
	my = my || {};

	var that = gis.ui.control.search(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'customerView';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Search Customer';

	my.dialog = gis.ui.dialog({ divid : my.id });

	my.tableId = "table-" + my.id;
	my.pagerId = "pager-" + my.id;

	my.height = 510;
	my.width = 940;
	my.url = './rest/Customers/';
	my.colModelSettings= [
       {name:"villageid",index:"villageid",width:60,align:"center",classes:"villageid_class"},
       {name:"villagename",index:"villagename",width:150,align:"left",classes:"villagename_class"},
       {name:"zone",index:"zone",width:50,align:"center",classes:"zone_class"},
       {name:"con",index:"con",width:70,align:"left",classes:"con_class"},
       {name:"name",index:"name",width:300,align:"left",classes:"name_class"},
       {name:"status",index:"status",width:60,align:"center",classes:"status_class"},
       {name:"serialno",index:"serialno",width:150,align:"left",classes:"serialno_class"},
       {name:"wkt",index:"wkt",width:300,align:"left",classes:"wkt_class"}
   ]
	my.colNames = ["Village ID","Village Name","Zone","Con","Customer Name","Status","Meter S/N","Location"];

	that.CLASS_NAME =  "gis.ui.control.search.customerView";
	return that;
};
