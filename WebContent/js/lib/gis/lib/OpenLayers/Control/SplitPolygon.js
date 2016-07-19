OpenLayers.Control.SplitPolygon = OpenLayers.Class(OpenLayers.Control.DrawFeature, {

	/**
     * Constructor: OpenLayers.Control.DrawHole
     * Create a new control for deleting features.
     *
     * Parameters:
     * layer - {<OpenLayers.Layer.Vector>}
     * options - {Object} An optional object whose properties will be used
     *     to extend the control.
     */
    initialize: function (layer, options) {
        this.callbacks = OpenLayers.Util.extend(this.callbacks, {
            point: function(point) {
                this.layer.events.triggerEvent('pointadded', {point: point});
            }
        });

        OpenLayers.Control.DrawFeature.prototype.initialize.apply(this,
            [layer, OpenLayers.Handler.Path, options]);

    },

    /**
     * Method: drawFeature
     * Cut hole only if area greater than or equal to minArea and all
     *     vertices intersect the targeted feature.
     * @param {OpenLayers.Geometry} geometry The hole to be drawn
     */
    drawFeature: function (geometry) {

    	if (geometry.CLASS_NAME !== 'OpenLayers.Geometry.LineString'){
    		return;
    	}

    	if (this.layer.features.length === 0){
    		return;
    	}

    	var removeFeatures = [];
    	var addFeatures = [];
    	var polygons = [];
    	for (var i = 0 in this.layer.features) {
            var layerFeature = this.layer.features[i];
            if (layerFeature.geometry.CLASS_NAME !== 'OpenLayers.Geometry.Polygon'){
            	continue;
            }
            var targetPolygonOp = gis.geometryOp.polygonOp({geometry : layerFeature.geometry.clone()});
            if (targetPolygonOp.overlapbdyDisjoint(geometry)){
            	polygons.push(targetPolygonOp.getGeometry());
            	removeFeatures.push(layerFeature);
            }
        }
    	if (polygons.length === 0){
    		//分割ラインと交差するポリゴンがない場合
    		return;
    	}
    	var multiPolygon = new OpenLayers.Geometry.MultiPolygon(polygons);
    	$.ajax({
			url : './rest/geometries/split?polygon=' + multiPolygon.toString() + '&line=' + geometry.toString(),
			type : 'GET',
			dataType : 'json',
			cache : false,
			async : false
    	}).done(function(json){
    		if (json.code !== 0){
    			alert(json.message);
    			return;
    		}
			var polygons = json.value;
			for (var i = 0 in polygons){
				var polygon = polygons[i];
				var feature = gis.geometryOp.toFeature(OpenLayers.Geometry.fromWKT(polygon));
				addFeatures.push(feature);
			}
    	}).fail(function(xhr){
			console.log(xhr.status + ';' + xhr.statusText);
			return;
    	});

    	if (addFeatures.length === 0){
    		return;
    	}
    	this.layer.removeFeatures(removeFeatures);
    	this.layer.addFeatures(addFeatures,{silent : true});
    	this.layer.events.triggerEvent("aftersplit", {
            add: addFeatures,
            remove : removeFeatures
        });
    },

	CLASS_NAME: 'OpenLayers.Control.SplitPolygon'
});