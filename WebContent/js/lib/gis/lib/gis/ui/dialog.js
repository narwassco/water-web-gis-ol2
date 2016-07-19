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