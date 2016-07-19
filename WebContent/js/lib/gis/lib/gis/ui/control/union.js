/**
 * 図形を結合するコントロール
 */
gis.ui.control.union = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'union';

	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || 'union';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'union';

	/**
	 * 結合処理完了後に削除するフィーチャを一時的に格納する
	 */
	my.removeFeatures = [];

	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		if (my.editingLayer.selectedFeatures.length === 0){
			alert('Please choose features.。');
			return;
		}
		if(!window.confirm('Do you want to union your selected features?')){
			return;
		}
		var polygons = [];
		my.removeFeatures = [];
		for (var i = 0 in my.editingLayer.selectedFeatures){
			var f = my.editingLayer.selectedFeatures[i];
			var p = f.geometry.clone();
			p.transform(my.editingLayer.map.projection,my.editingLayer.map.displayProjection);
			polygons.push(p);
			my.removeFeatures.push(f);
		}
		var multiPolygon = new OpenLayers.Geometry.MultiPolygon(polygons);
		$.ajax({
			url : './rest/geometries/union?polygon=' + multiPolygon.toString(),
			type : 'GET',
			dataType : 'json',
			cache : false,
			async : false
		}).done(function(json){
			if (json.code !== 0){
				alert(json.message);
    			return;
    		}
			var polygon = json.value;
			if (polygon === ""){
				return;
			}

			var olgeom = OpenLayers.Geometry.fromWKT(polygon);
			olgeom.transform(my.editingLayer.map.displayProjection,my.editingLayer.map.projection);
			var feature = gis.geometryOp.toFeature(olgeom);
			my.editingLayer.removeFeatures(my.removeFeatures);
	    	my.editingLayer.addFeatures([feature],{silent : true});
	    	my.editingLayer.events.triggerEvent("afterunion", {
	            add: feature,
	            remove : my.removeFeatures
	        });
		}).fail(function(xhr){
			console.log(xhr);
			alert(xhr.status + ';' + xhr.statusText);
			return;
		});
	};

	that.CLASS_NAME =  "gis.ui.control.union";
	return that;
};