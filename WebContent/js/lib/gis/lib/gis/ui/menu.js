gis.ui.menu = function(spec,my){
	my = my || {};

	var that = gis.ui(spec,my);

	/**
	 * メニューのID
	 */
	my.menuid = spec.menuid;

	my.defineurl = spec.defineurl;

	/**
	 * OpenLayers.Mapオブジェクト
	 */
	my.map = spec.map;

	my.controlloader = gis.ui.controlloader({parent : my});

	my.getMenuList = function(){
		var menulist = [];
    	$.ajax({
			url : my.defineurl,
			type : 'GET',
			dataType : 'json',
			cache : false,
			async : false
		}).done(function(menus) {
			menulist = menus;
		});
    	return menulist;
	};

    /**
     * メニュー初期化
     */
	that.init = function(){
		alert("Please overwrite this method in sub class.")
	};

	that.CLASS_NAME =  "gis.ui.menu";
	return that;
};