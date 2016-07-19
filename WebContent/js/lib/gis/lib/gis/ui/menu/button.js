gis.ui.menu.button = function(spec,my){
	my = my || {};

	var that = gis.ui.menu(spec,my);

	/**
	 * メニューのID
	 */
	my.menuid = '.menu.button';

	my.controlloader = gis.ui.controlloader({parent : my});

    /**
     * メニュー初期化
     */
	that.init = function(){
		var menulist = my.getMenuList();
		var html = "";
		var ctrlList = [];
		for (var i = 0 in menulist){
			var menu = menulist[i];
			var control = my.controlloader.getControl(menu);
			html += "<td>" + control.createButtonHtml() + "</td>";
			ctrlList.push(control);
		};
		html = "<table><tr>" + html + "</tr></table>";
		$("#" + my.divid).html(html);

		for (var i = 0 in ctrlList){
			var item = ctrlList[i];
			$("#" + item.getId()).click(item.execute)
		};
	};

	that.CLASS_NAME =  "gis.ui.menu.button";
	return that;
};