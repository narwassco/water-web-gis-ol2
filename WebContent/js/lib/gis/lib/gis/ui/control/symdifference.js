/**
 * 図形をsymdifferenceするコントロール
 */
gis.ui.control.symdifference = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'symdifference';

	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || 'symdifference';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'symdifference';

	/**
	 * 処理完了後に削除するフィーチャを一時的に格納する
	 */
	my.removeFeatures = [];

	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		if (my.editingLayer.selectedFeatures.length !== 2){
			alert('Please choose 2 features.');
			return;
		}

		var feature1 = my.editingLayer.selectedFeatures[0].clone();
		var feature2 = my.editingLayer.selectedFeatures[1].clone();
		feature1.geometry.transform(my.editingLayer.map.projection,my.editingLayer.map.displayProjection);
		feature2.geometry.transform(my.editingLayer.map.projection,my.editingLayer.map.displayProjection);

		if (!feature1.geometry.intersects(feature2.geometry)){
			alert('Thease features do not cross each other.');
			return;
		}

		if(!window.confirm('Do you want to create a symdifference part of your selected features?')){
			return;
		}

		my.removeFeatures = my.editingLayer.selectedFeatures;

		$.ajax({
			url : './rest/geometries/symdifference?geom1=' + feature1.geometry.toString() + '&geom2=' + feature2.geometry.toString(),
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
	    	my.editingLayer.events.triggerEvent("aftersymdifference", {
	            add: addFeatures,
	            remove : my.removeFeatures
	        });
		}).fail(function(xhr){
			console.log(xhr);
			alert(xhr.status + ';' + xhr.statusText);
			return;
		});
	};

	that.CLASS_NAME =  "gis.ui.control.symdifference";
	return that;
};