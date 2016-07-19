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