gis.geometryOp.polygonOp = function(spec,my){
	my = my || {};

	var that = gis.geometryOp(spec,my);

	/**
	 * ポリゴンを指定ラインが貫いているかチェックする
	 * @param line OpenLayers.Geometry.LineString
	 * @returns {Boolean}
	 */
	that.overlapbdyDisjoint = function(line){
		//ラインがポリゴンと交差しているか
    	var vertices = line.getVertices();
        var intersects = my.geometry.intersects(line);
        if (intersects === true){
        	//ラインの端点がポリゴンの外にあるか
        	if (my.geometry.intersects(vertices[0]) || my.geometry.intersects(vertices[vertices.length-1])) {
                intersects = false;
            }
        }
        return intersects;
	};
	
	/**
	 * ポリゴンをマルチラインストリングに変換する
	 */
	that.toMultiLineString = function(){
		var lines = [];
		for (var iRing = 0 in my.geometry.components){
			var ring = my.geometry.components[iRing];
			for (var iPoint = 0 ; iPoint < ring.components.length -1;iPoint++){
				var from = ring.components[iPoint];
				var to = ring.components[iPoint + 1];
				
				var line = new OpenLayers.Geometry.LineString([from,to]);
				lines.push(line);
			}
		}
		return new OpenLayers.Geometry.MultiLineString(lines);
	};
	
	that.CLASS_NAME =  "gis.geometryOp.polygonOp";
	return that;
};
