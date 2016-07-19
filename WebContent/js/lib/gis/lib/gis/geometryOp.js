/**
 * ジオメトリに対して操作を行うクラスのトップクラス
 */
gis.geometryOp = function(spec,my){
	var that= {};

	my = my || {};

	my.geometry = spec.geometry;
	
	/**
	 * OpenLayers.Geometryを取得する
	 * @returns {OpenLayers.Geometry}
	 */
	that.getGeometry = function(){
		return my.geometry;
	};
	
	/**
	 * OpenLayers.geometryを設定する
	 * @param geom OpenLayers.Geometry
	 */
	that.setGeometry = function(geom){
		my.geometry = geom;
	};
	
	/**
     * OpenLayers.GeometryからOpenLayers.Feature.Vectorを作成する
     * @returns {OpenLayers.Feature.Vector}
     */
    that.toFeature = function(){
    	var feature = new OpenLayers.Feature.Vector(my.geometry);
        feature.state = OpenLayers.State.INSERT;
        return feature;
    },
    
    that.toString = function(){
    	return my.geometry.toString();
    };
	
	that.CLASS_NAME =  "gis.geometryOp";
	return that;
};

/**
 * OpenLayers.GeometryからOpenLayers.Feature.Vectorを作成する
 * @param OpenLayers.Geometry
 * @returns {OpenLayers.Feature.Vector}
 */
gis.geometryOp.toFeature = function(geometry){
	var geomOp = gis.geometryOp({geometry : geometry});
	return geomOp.toFeature();
};