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