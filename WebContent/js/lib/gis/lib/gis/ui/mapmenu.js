/**
 * 編集メニューを管理するクラス
 */
gis.ui.mapmenu = function(spec,my){
	my = my || {};

	var that = gis.ui(spec,my);

	/**
	 * メニューのID
	 */
	my.menuid = 'controlToggle';

	/**
	 * メニューの幅
	 */
	my.menuwidth = spec.width;

	/**
	 * OpenLayers.Mapオブジェクト
	 */
	my.map = spec.map;

	/**
	 * 編集用のOpenLayers.Layer.Vectorオブジェクト
	 */
	my.editingLayer = new OpenLayers.Layer.Vector( "Editable" );

	/**
	 * コントロールチェック時のコールバック関数
	 */
	my.toggleControl = function(element) {
		for (var i = 0 in my.ctrlObjArray){
        	var obj = my.ctrlObjArray[i];
        	obj.changeActivate(element);
        }
    },

    /**
	 * 地図編集コントロールの配列
	 */
	my.olcontrols = [],

    my.getMenuList = function(){
    	var selectmenu = {
				id : 'select',
            	 name : 'Select',
            	 items : [
            	          gis.ui.control.none({}),
            	          gis.ui.control.zoomBox({})
            	          //gis.ui.control.selectFeature({editingLayer : my.editingLayer})
            	          ]
		};

    	var worksheetmenu = {
				id : 'worksheet',
            	 name : 'O&M',
            	 items : [
            	          gis.ui.control.reportLeakage({map : my.map})
            	          ]
		};

    	var searchmenu = {
				id : 'search',
            	 name : 'Search',
            	 items : [
            	          //gis.ui.control.search.customerView({map : my.map}),
            	          gis.ui.control.zoomToExtent.kapsabet({map : my.map}),
            			  gis.ui.control.zoomToExtent.nandihill({map : my.map})
            	          ]
		};

    	var toolsmenu = {
				id : 'tools',
            	name : 'Tools',
            	items : [
            	         gis.ui.control.measure.calcDistance({}),
            	         gis.ui.control.measure.calcArea({}),
            	         gis.ui.control.graticule({map : my.map})
            	         ]
		};

    	/*var uploadmenu = {
            	id : 'upload',
            	name : 'Upload',
            	items : [
            	         gis.ui.control.uploadBillingData({})
            	         ]
            };

    	var downloadmenu = {
            	id : 'download',
            	name : 'Download',
            	items : [
            	         gis.ui.control.uncapturedMeter({})
            	         ]
            };*/

		return [selectmenu,worksheetmenu,searchmenu,toolsmenu/*,uploadmenu,downloadmenu*/];
    };

    my.createCallback = function(id){;
		for (var j = 0 in my.olcontrols){
			var temp = my.olcontrols[j];
			if (temp.getId() === id){
				temp.activate();
			}else{
				temp.deactivate();
			}
		}
    };

    /**
     * メニュー初期化
     */
	that.init = function(){
		my.map.addLayer(my.editingLayer);

		var menulist = my.getMenuList();
		var menuhtml = "";
		for (var i = 0 in menulist){
			var menu = menulist[i];
			menuhtml += "<li class='dropdown_item'>" ;
			menuhtml += "<a href='#' id='" + menu.id + "'>" + menu.name + "</a>" ;
			if (menu.items){
				var itemhtml = "";
				for (var j = 0 in menu.items){
					var item = menu.items[j];
					itemhtml += "<li>" ;
					itemhtml += item.createHtml() ;
					itemhtml += "</li>";
				}
				menuhtml += "<ul>" + itemhtml + "</ul>";
			}
			menuhtml += "</li>";
		}
		menuhtml = "<ul class='dropdown'>" + menuhtml + "</ul><div style='clear:both;'></div>";
		$("#" + my.divid).html(menuhtml);

		$('ul.dropdown li.dropdown_item').hover(
				function(){
					$(this).find('ul').slideDown(200);
				},
				function(){
					$(this).find('ul').hide();
				}
			);
		$("#" + my.divid).addClass('ui-widget-content ui-corner-all');
		$('li.dropdown_item > ul').addClass('ui-widget-content ui-corner-all');
		$('li.dropdown_item > ul').hide();

		my.olcontrols = [];
		for (var i = 0 in menulist){
			for (var j = 0 in menulist[i].items){
				var item = menulist[i].items[j];
				if (!item.isOlControl()){
					continue;
				}
				my.olcontrols.push(item);
			}
		}

		for (var i = 0 in my.olcontrols){
			var ctrl = my.olcontrols[i];
			ctrl.addControlInMap(gistools.map);
			$("#" + ctrl.getId()).click(function(obj){
				my.createCallback(obj.target.id);
			});
		}

		for (var i = 0 in menulist){
			for (var j = 0 in menulist[i].items){
				var item = menulist[i].items[j];
				if (!item.isOlControl()){
					$("#" + item.getId()).click(item.execute);
				}
			}
		}
	};

	/**
	 * 地図編集メニューをすべて非アクティブにする
	 */
	that.allDeactivate = function(){
		for (var i = 0 in my.olcontrols){
			var ctrl = my.olcontrols[i];
			ctrl.deactivate();
		}
	};


	that.CLASS_NAME =  "gis.ui.mapmenu";
	return that;
};