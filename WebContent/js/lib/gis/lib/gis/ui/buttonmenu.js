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