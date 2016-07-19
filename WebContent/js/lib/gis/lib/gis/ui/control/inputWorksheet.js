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