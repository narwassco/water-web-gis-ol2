/**
 * 編集メニューを管理するクラス
 */
gis.ui.menu.dropdown = function(spec,my){
	my = my || {};

	var that = gis.ui.menu(spec,my);

	/**
	 * メニューのID
	 */
	my.menuid = 'menu.dropdown';

	/**
	 * メニューの幅
	 */
	my.menuwidth = spec.width;

	my.layerMap = spec.layerMap;

	/**
	 * 編集用のOpenLayers.Layer.Vectorオブジェクト
	 */
	my.editingLayer = new OpenLayers.Layer.Vector( "Editable" );

	my.worksheetLayer = my.map.getLayersByName("O&M Worksheets")[0];

	my.controlloader = gis.ui.controlloader({parent : my});

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
     * undoredo管理用のコントローラ
     */
    my.undoredoController = gis.ui.controller.undoredo({layer : my.editingLayer});

    /**
	 * 地図編集コントロールの配列
	 */
	my.olcontrols = [],

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
		var controlObjList = [];
		var menuhtml = "";
		for (var i = 0 in menulist){
			var menu = menulist[i];
			menuhtml += "<li class='dropdown_item'>" ;
			menuhtml += "<a href='#' id='" + menu.id + "'>" + menu.name + "</a>" ;
			if (menu.controls){
				var itemhtml = "";
				for (var j = 0 in menu.controls){
					var item = my.controlloader.getControl(menu.controls[j]);
					itemhtml += "<li>" ;
					itemhtml += item.createHtml() ;
					itemhtml += "</li>";
					controlObjList.push(item);
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
		for (var i = 0 in controlObjList){
			var control = controlObjList[i];
			if (!control.isOlControl()){
				continue;
			}
			my.olcontrols.push(control);
		}

		for (var i = 0 in my.olcontrols){
			var ctrl = my.olcontrols[i];
			ctrl.addControlInMap(gistools.map);
			$("#" + ctrl.getId()).click(function(obj){
				my.createCallback(obj.target.id);
			});
		}

		for (var i = 0 in controlObjList){
			var item = controlObjList[i];
			if (!item.isOlControl()){
				$("#" + item.getId()).click(item.execute);
			}
		}

		my.undoredoController.setMenuObj(this);
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


	that.CLASS_NAME =  "gis.ui.menu.dropdown";
	return that;
};