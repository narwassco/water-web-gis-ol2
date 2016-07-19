/**
 * バッファを作成するコントロール
 */
gis.ui.control.buffer = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'buffer';

	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || 'buffer';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Buffer';

	/**
	 * バッファ処理完了後に削除するフィーチャを一時的に格納する
	 */
	my.removeFeatures = [];

	my.dialog = gis.ui.dialog({ divid : my.id });

	/**
	 * コンストラクタ
	 */
	my.init = function(){
		var html = my.getHtml();
		my.dialog.create(html,{
			title : 'Buffer Option',
			buttons : {
				'OK' : function(){
					my.buffer();
				},
				'Close' : function(){
					my.dialog.close();
				}
			}
		});
	};

	my.getHtml = function(){
		var html = "<label for='distance" + my.id + "'>Distance</label>" +
		"<input id='distance" + my.id + "' type='number' min=0 max=99 name='distance' value='1'/>" +
		"<label for='distance" + my.id + "'>m</label>";
		return html;
	};

	my.buffer = function(){
		if(!window.confirm('Do you want to create buffer of your selected feature?')){
			return;
		}
		var collection = [];
		my.removeFeatures = [];
		for (var i = 0 in my.editingLayer.selectedFeatures){
			var f = my.editingLayer.selectedFeatures[i];
			var p = f.geometry.clone();
			p.transform(my.editingLayer.map.projection,my.editingLayer.map.displayProjection);
			collection.push(p);
			my.removeFeatures.push(f);
		}
		var geomCollection = new OpenLayers.Geometry.Collection(collection);
		var distance = $("#distance" + my.id).val();
		distance = distance / 100000; //メートルに変換
		$.ajax({
			url : './rest/geometries/buffer?geometries=' + geomCollection.toString() + "&distance=" + distance,
			type : 'GET',
			dataType : 'json',
			cache : false,
			async : false
		}).done(function(json){
			if (json.code !== 0){
    			alert(json.message);
    			return;
    		}
			var geometries = json.value;
			if (geometries.length === 0){
				return;
			}
			var addFeatures = [];
			for (var i = 0 in geometries){
				var geometry = geometries[i];
				var olgeom = OpenLayers.Geometry.fromWKT(geometry);
				olgeom.transform(my.editingLayer.map.displayProjection,my.editingLayer.map.projection);
				var feature = gis.geometryOp.toFeature(olgeom);
				addFeatures.push(feature);
			}

			my.editingLayer.removeFeatures(my.removeFeatures);
	    	my.editingLayer.addFeatures(addFeatures,{silent : true});
	    	my.editingLayer.events.triggerEvent("afterbuffer", {
	            add: addFeatures,
	            remove : my.removeFeatures
	        });
	    	my.dialog.close();
		}).fail(function(xhr){
			console.log(xhr);
			alert(xhr.status + ';' + xhr.statusText);
			return;
		});
	};

	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		if (my.editingLayer.selectedFeatures.length === 0){
			alert('Please choose feature.');
			return;
		}
		my.init();
		my.dialog.open();
	};


	that.CLASS_NAME =  "gis.ui.control.buffer";
	return that;
};