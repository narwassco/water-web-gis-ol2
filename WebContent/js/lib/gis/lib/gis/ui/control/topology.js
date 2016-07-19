gis.ui.control.topology = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'topology';


	/**
	 * inputタグのvalue属性
	 */
	my.value = spec.value || 'topology';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Topology Edit';

	/**
	 * 地図関係の編集コントロールかどうか
	 */
	my.isOlControl = true;

	/**
	 * トポロジー編集用のレイヤ
	 */
	my.topologyLayer = null;

	/**
	 * 編集レイヤ上の選択コントロール
	 */
	my.selectCtrlInEdit = null;

	/**
	 * トポロジーレイヤ上の編集コントロール
	 */
	my.modifyCtrlInTopology = null;

	/**
	 * トポロジー修正対象の元ポリゴン
	 */
	my.targetPolygon = null;

	/**
	 * トポロジー修正対象の端点ジオメトリ
	 */
	my.targetVertex = null;

	/**
	 * トポロジー修正前のジオメトリ
	 */
	my.beforeFeature = null;

	my.isInit = false;

	/**
	 * コンストラクタ
	 */
	my.init = function(){
		if (my.isInit === true){
			return;
		}
		var style = {};
		for (var key in OpenLayers.Feature.Vector.style){
			var temp = {};
			for (var name in OpenLayers.Feature.Vector.style[key]){
				temp[name] = OpenLayers.Feature.Vector.style[key][name];
			}
			style[key] = temp;
		}
		style['default'].fillOpacity= 0;
		//style['default'].strokeWidth= 5;
		my.topologyLayer = new OpenLayers.Layer.Vector(my.id,{
			styleMap : new OpenLayers.StyleMap(style)
		});
		my.map.addLayer(my.topologyLayer);

		my.selectCtrlInEdit = new OpenLayers.Control.SelectFeature([my.editingLayer],{
			geometryTypes : ['OpenLayers.Geometry.Polygon'],
			clickout: false, toggle: true,multiple: false, hover: false
		});

		my.modifyCtrlInTopology = new OpenLayers.Control.ModifyFeature(my.topologyLayer,{
			geometryTypes : ['OpenLayers.Geometry.Polygon']
		});

		my.map.addControls([my.selectCtrlInEdit,my.modifyCtrlInTopology]);

		my.isInit = true;
	};

	my.polygonToMultiLineArray = function(polygon){
		var polygonOp = gis.geometryOp.polygonOp({geometry : polygon.clone()});
		var multiline = polygonOp.toMultiLineString();
		var features = [];
		for (var i = 0 in multiline.components){
			var line = multiline.components[i];
			var geomOp = gis.geometryOp({geometry : line});
			features.push(geomOp.toFeature());
		}
		return features;
	};

	my.beforefeatureselected = function(e){
		//選択したポリゴンをラインに変換してトポロジーレイヤに追加
		if (my.targetPolygon === null){
			my.targetPolygon = e.feature.geometry.clone();
		}
		var geomOp = gis.geometryOp({geometry : my.targetPolygon.clone()});
		var selectedFeature = geomOp.toFeature();
		my.topologyLayer.removeAllFeatures({silent : true});
		my.topologyLayer.addFeatures([selectedFeature],{silent : true});
		my.editingLayer.events.unregister('beforefeatureselected',my.editingLayer);
		my.selectCtrlInEdit.deactivate();

		my.topologyLayer.events.register('beforefeaturemodified',my.topologyLayer,my.beforefeaturemodified);
		my.topologyLayer.events.register('afterfeaturemodified',my.topologyLayer,my.afterfeaturemodified);
		my.topologyLayer.events.register('vertexmodified',my.topologyLayer,my.vertexmodified);
		my.modifyCtrlInTopology.activate();
		my.modifyCtrlInTopology.selectFeature(selectedFeature);

		return false;
	};

	my.beforefeaturemodified = function(e){
		if (my.targetVertex === null){
			my.beforeFeature = e.feature.clone();
		}
	};

	/**
	 * ラインの端点が修正されたときのイベント
	 */
	my.vertexmodified = function(e){
		//修正中の端点を対比する
		my.targetVertex = e.vertex;
	};

	/**
	 * トポロジー修正をキャンセルする
	 */
	my.cancelModify = function(){
		my.topologyLayer.removeAllFeatures({silent : true});
		if (my.targetPolygon === null){
			return;
		}
		my.afterActivate();
	};

	/**
	 * トポロジー編集対象及び隣接のフィーチャの退避領域
	 */
	my.removeFeatures = [];

	/**
	 * ライン自体の修正が完了した時のイベント
	 */
	my.afterfeaturemodified  = function(e){
		if (my.beforeFeature === null){
			return;
		}

		//隣接ポリゴンを求める
		var polygons = [];
		for (var i = 0 in my.editingLayer.features){
			var feature = my.editingLayer.features[i];
			if (feature.geometry.equals(my.beforeFeature.geometry)){
				my.removeFeatures.push(feature);
				continue;
			}
			if (feature.geometry.intersects(my.beforeFeature.geometry)){
				polygons.push(feature.geometry);
				my.removeFeatures.push(feature);
			}
		}
		if (polygons.length === 0){
			my.cancelModify();
		}
		var touches = new OpenLayers.Geometry.MultiPolygon(polygons);

		$.ajax({
			url : './rest/geometries/topology?before=' + my.beforeFeature.geometry.toString()
				+ '&after=' + e.feature.geometry.toString()
				+ '&touchedPolygon=' + touches.toString(),
			type : 'GET',
			dataType : 'json',
			cache : false,
			async : false
		}).done(function(obj){
			if (obj.code !== 0){
    			alert(obj.message);
    			return;
    		}
			var obj = obj.value;
			var target = new OpenLayers.Geometry.fromWKT(obj.target);
			var touches = new OpenLayers.Geometry.fromWKT(obj.touches);
			var addFeatures = [];
			addFeatures.push(gis.geometryOp.toFeature(target));
			for (var i = 0 in touches.components){
				var geometry = touches.components[i];
				var feature = gis.geometryOp.toFeature(geometry);
				addFeatures.push(feature);
			}
			my.editingLayer.removeFeatures(my.removeFeatures);
	    	my.editingLayer.addFeatures(addFeatures,{silent : true});
	    	my.afterDeactivate();
		}).fail(function(xhr){
			console.log(xhr);
			my.cancelModify();
			return;
		});

	};


	/**
	 * コントロールがアクティブになった後の処理（オプション用）
	 */
	my.afterActivate = function(){
		my.init();
		my.clearCondition();
		my.modifyCtrlInTopology.deactivate();
		my.selectCtrlInEdit.activate();
		my.editingLayer.events.register('beforefeatureselected',my.editingLayer,my.beforefeatureselected);
	};

	/**
	 * コントロールが非アクティブになった後の処理
	 */
	my.afterDeactivate = function(){
		my.editingLayer.events.unregister('beforefeatureselected',my.editingLayer);
		if (my.topologyLayer){
			my.topologyLayer.events.unregister('beforefeaturemodified',my.topologyLayer);
			my.topologyLayer.events.unregister('afterfeaturemodified',my.topologyLayer);
			my.topologyLayer.events.unregister('vertexmodified',my.topologyLayer);
			my.topologyLayer.removeAllFeatures({silent:true});
			my.selectCtrlInEdit.deactivate();
			my.modifyCtrlInTopology.deactivate();
		}
		my.clearCondition();
	};

	my.clearCondition = function(){
		my.targetPolygon = null;
		my.targetVertex = null;
		my.beforeFeature = null;
	};

	that.CLASS_NAME =  "gis.ui.control.topology";
	return that;
};