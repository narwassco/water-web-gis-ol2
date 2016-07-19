gis.ui.control.printMap = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'printMap';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Print Map';

	/**
	 * OpenLayers.Mapオブジェクト
	 */
	my.map = spec.map;

	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		var e = my.map.getExtent().toBBOX();
		$.ajax({
			url : './rest/MapPdf/A4?bbox=' + e,
			type : 'GET',
			dataType : 'json',
			cache : false,
			async : false
    	}).done(function(json){
    		if (json.code !== 0){
    			alert(json.message);
    			return;
    		}

    		window.open(json.value);
    	}).fail(function(xhr){
			console.log(xhr.status + ';' + xhr.statusText);
			return;
    	});
	};

	that.CLASS_NAME =  "gis.ui.control.printMap";
	return that;
};