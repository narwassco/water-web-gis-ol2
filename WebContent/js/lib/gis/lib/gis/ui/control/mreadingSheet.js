/**
 * The tool for downloading a list of Meter Reading Sheets
 */
gis.ui.control.mreadingSheet = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'mreadingSheet';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Meter Reading Sheets';

	my.villages = {};

	my.areas = {};
	my.checkboxIdAndAreaMap = {};

	my.dialog = gis.ui.dialog({ divid : my.id });

	/**
	 * コンストラクタ
	 */
	my.init = function(){
		my.getVillages();
		var html = my.getHtml();
		my.dialog.create(html,{
			title : 'Meter Reading Sheets',
			modal : true,
			height : 500,
			width : 500,
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
		my.setEventForCheckbox();
	};

	my.getHtml = function(){
		var html = "";
		my.areas = {};
		for (var i = 0 in my.villages){
			var v = my.villages[i];
			if (!my.areas[v.area]){
				my.areas[v.area] = [];
			}
			my.areas[v.area].push(v);
		}

		html = "<ul>";
		for (var area in my.areas){
			html += "<li><label><input type='checkbox' id='checkAll" + area + "'>" + area + "</label></li>";
			html += "<ul id='checkboxArea" + area + "'>";
			for (var i = 0 in my.areas[area]){
				var v = my.areas[area][i];
				html += "<li><label><input type='checkbox' name='villages' value='" + v.villageid + "' checked>" + v.villageid + ":" + v.name + "</label></li>";
			}
			html += "</ul>";
		}
		html += "</ul>";

		return html;

	};

	my.setEventForCheckbox = function(){
		for (var area in my.areas){
			my.checkboxIdAndAreaMap["checkboxArea" + area] = area
			$("#checkboxArea" + area).click(function () {
				var _id = $(this).attr("id");
				var _area = my.checkboxIdAndAreaMap[_id];
				var checkboxCount = $("#" + _id + " input[type=checkbox]").length;
		        var selectedCount = $("#" + _id + " input[type=checkbox]:checked").length;
		        if (checkboxCount === selectedCount) {
		            $("#checkAll" + _area).prop("indeterminate", false).prop("checked", true );
		        } else if (0 === selectedCount) {
		            $("#checkAll" + _area).prop("indeterminate", false).prop("checked", false);
		        } else {
		            $("#checkAll" + _area).prop("indeterminate", true ).prop("checked", false);
		        }
			}).click();
			my.checkboxIdAndAreaMap["checkAll" + area] = area
			$("#checkAll" + area).click(function () {
				var _id = $(this).attr("id");
				var _area = my.checkboxIdAndAreaMap[_id];
				var checked = $("#" + _id).prop("checked");
				$("#checkboxArea" + _area + "  input[type=checkbox]").each(function(){
					$(this).prop("checked", checked);
				});
			});
		}
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
    			my.villages[v.villageid] = v;
    		}
    	}).fail(function(xhr){
			console.log(xhr.status + ';' + xhr.statusText);
			return false;
    	});
	}

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
		var villages = [];
		$('[name="villages"]:checked').each(function(){
			villages.push($(this).val());
		});
		if (villages.length === 0){
			alert("Check a village at least.");
			return;
		}
		$.ajax({
			url : './rest/Meters/MReading?villageid=' + JSON.stringify(villages),
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

	that.CLASS_NAME =  "gis.ui.control.mreadingSheet";
	return that;
};