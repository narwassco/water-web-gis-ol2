/**
 * uiコントロールの最上位クラス
 */
gis.ui.layer = function(spec,my){
	var that= {};

	my = my || {};

	my.map = spec.map;
	my.defineurl = spec.defineurl;
	my.mapservurl = spec.mapservurl;

	that.init = function(){
		$.ajax({
			url : my.defineurl,
			type : 'GET',
			dataType : 'json',
			cache : false,
			async : false
		}).done(function(layers) {
			var layerarray = [];
			for (var i = 0 in layers){
				var layer = layers[i];
				var isBaseLayer = layer.isBaseLayer;
				var transparent = false;
				if (layer.isBaseLayer !== true){
					isBaseLayer = false;
					transparent = true;
				}
				var visible = layer.visible;
				if (layer.visible !== false){
					visible = true;
				}
				var obj = null;
				if (layer.type === "WMS"){
					obj = new OpenLayers.Layer.WMS(
							layer.name,
							my.mapservurl + 'map=' + layer.file,
							{
								layers: layer.layers,
								srs:"EPSG:4326",
								format:'image/png',
								transparent : transparent
							},
							{
								isBaseLayer : isBaseLayer,
								singleTile: true
							});
				} else if (layer.type === "WFS"){
					var vector_style_map = new OpenLayers.StyleMap();
					if (layer['rules']){
						var fieldname = layer.rules["fieldname"];
						var stylerules = layer.rules["styles"];
						var rules = [];
						for (var j in stylerules){
							rules.push(new OpenLayers.Rule({
			                    // a rule contains an optional filter
			                    filter: new OpenLayers.Filter.Comparison({
			                        type: OpenLayers.Filter.Comparison.LIKE,
			                        property: fieldname, // the "foo" feature attribute
			                        value: j
			                    }),
			                    // if a feature matches the above filter, use this symbolizer
			                    symbolizer: stylerules[j]
			                }));
						}
						var vector_style = new OpenLayers.Style();
						vector_style.addRules(rules);
		                //Create a style map object
		                vector_style_map = new OpenLayers.StyleMap({
		                    'default' : vector_style
		                });
					}

					obj = new OpenLayers.Layer.Vector(layer.name,{
						styleMap : vector_style_map,
						strategies: [new OpenLayers.Strategy.BBOX()],
						 protocol: new OpenLayers.Protocol.WFS({
		                      "url": my.mapservurl + 'map=' + layer.file,
		                      "featureType": layer.layers
		                  })
					});
				}else{
					continue;
				}
				obj.setVisibility(visible);
				layerarray.push(obj);
			}
			my.map.addLayers(layerarray);
		});
	};

	that.CLASS_NAME =  "gis.ui.layer";
	return that;
};