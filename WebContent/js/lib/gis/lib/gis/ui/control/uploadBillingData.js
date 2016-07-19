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