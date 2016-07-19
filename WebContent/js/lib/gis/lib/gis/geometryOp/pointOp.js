gis.geometryOp.pointOp = function(spec,my){
	my = my || {};

	var that = gis.geometryOp(spec,my);
	
	/**
	 * 座標精度を指定精度で切り捨てる
	 * @param precision 小数点第何位
	 * @returns {OpenLayers.Geometry.Point}
	 */
	that.floor = function(precision){
		if (!precision){
    		precision = 8;
    	}
    	var __pre = Math.pow(10,precision);
    	var x = my.geometry.x * __pre;
    	var y = my.geometry.y * __pre;
    	
    	my.geometry.x = Math.round(x) / __pre;
    	my.geometry.y = Math.round(y) / __pre;
    	return my.geometry;
	};
	
	that.CLASS_NAME =  "gis.geometryOp.pointOp";
	return that;
};