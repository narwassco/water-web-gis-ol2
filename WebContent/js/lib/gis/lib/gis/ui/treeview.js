gis.ui.treeview = function(spec,my){
	my = my || {};

	var that = gis.ui(spec,my);
	
	my.id = spec.id;
	
	my.optionId = spec.optionId;
	
	my.map = spec.map;
	
	my.width = spec.width;
	
	my.baselayers = [];
	
	my.nonbaselayers = [];
	
	my.createRoot = function(){
		var html = "<ul id='root' class='filetree'>ルート</ul>";
		$("#" + my.id).html(html);
		$("#" + my.id).width(my.width);
		$("#" + my.optionId).width(my.width);
	};
	
	my.complete = function(){
		$("#" + my.id).treeview();
	};
	
	my.createNode = function(id,name){
		var html = "";
		html += "<li><span class='folder'>" + name + "</span>";
		html += "<ul id='" + id + "'>";
		html += "</ul>";
		html += "</li>";
		
		$("#root").append(html);
	};
	
	my.addChildNode = function(parent,layer){
		if (layer.displayInLayerSwitcher === false){
			return;
		}
		
		var html = "<li>";
		if (layer.isBaseLayer){
			html += "<input type='radio' id='ctrl" + layer.div.id + "' name='ctrl" + parent + "' value=" + layer.div.id + ">";
		}else{
			html += "<input type='checkbox' id='ctrl" + layer.div.id + "' value='" + layer.div.id + "'>";
		}
		html += "<label id='lbl" + layer.div.id + "' data-id='" + layer.div.id + "'>" + layer.name + "</label></li>";
		$("#" + parent).append(html);
		
		$("#ctrl" + layer.div.id).attr("checked",layer.getVisibility());
		
		if (layer.isBaseLayer){
			$("input[name=ctrl" + parent + "]:radio").change(function(e){
				var layer = my.map.getLayer(e.target.value);
				my.map.setBaseLayer(layer);
			});
		}else{
			$("#ctrl" + layer.div.id).click(function(e){
				var layer = my.map.getLayer(e.target.value);
				layer.setVisibility(!layer.getVisibility());
			});
		}
		
		$("#lbl" + layer.div.id).click(function(e){
			var layer = my.map.getLayer($("#" + e.target.id).data("id"));
			my.createOptionalBox(layer);
		});
	};
	
	my.createOptionalBox = function(layer){
		var html = "<table class='gis-ui-tableview-option-table'>" +
				"<tr><th>名前</th><td>" + layer.name + "</td></tr>" +
				"<tr><th>EPSG</th><td>" + layer.projection.projCode + "</td></tr>" +
				"<tr><th>ズーム<br>レベル</th><td>" + layer.numZoomLevels + "</td></tr>" +
				"<tr><th>透過率</th><td><div id='" + layer.div.id + "-slider' data-id='" + layer.div.id + "'></td></tr>" +
				"<tr><td colspan='2'><button id='btn" + layer.div.id + "' value='" + layer.div.id +"' style='width:100%'>全体表示</button></td></tr>" +
				"</table>";
		$("#" + my.optionId).html(html);
		
		$("#" + layer.div.id + "-slider").slider({
			value : layer.opacity * 100,
			min : 0,
			max : 100,
			step : 1,
			range : "min"
		});
		$("#" + layer.div.id + "-slider").on("slidechange",function(e,ui){
			var layer = my.map.getLayer($("#" + e.target.id).data("id"));
			layer.setOpacity(ui.value / 100);
		});
		
		$("#btn" + layer.div.id).click(function(e){
			console.log(e.target.value);
			var layer = my.map.getLayer(e.target.value);
			my.map.zoomToExtent(layer.maxExtent);
		});
	};
	
	that.init = function(){
		
		var layers = my.map.layers;
		my.baselayers = [];
		my.nonbaselayers = [];
		for (var i = 0 in layers){
			var layer = my.map.getLayer(layers[i].div.id);
			if (layer.isBaseLayer){
				my.baselayers.push(layer);
			} else{
				my.nonbaselayers.push(layer);
			}	
		}
		
		my.createRoot();
		
		var list = [
		            {array : my.baselayers,id:'BaseLayer',name:'背景'},
		            {array : my.nonbaselayers,id:'NonBaseLayer',name:'オプション'}
		            ];
		
		for (var i = 0 in list){
			var obj = list[i];
			my.createNode(obj.id,obj.name);
			for (var i = 0 in obj.array){
				var layer = obj.array[i];
				my.addChildNode(obj.id,layer);
			}
		}
		my.complete();
		
	};
	
	that.CLASS_NAME =  "gis.ui.treeview";
	return that;
};