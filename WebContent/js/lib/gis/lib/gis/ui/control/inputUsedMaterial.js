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