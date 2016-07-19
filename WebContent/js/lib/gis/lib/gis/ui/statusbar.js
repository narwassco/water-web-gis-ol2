
gis.ui.statusbar = function(spec,my){
	my = my || {};

	var that = gis.ui(spec,my);
	
	/**
	 * メニューのID
	 */
	my.menuid = 'controlToggle';
	
	/**
	 * OpenLayers.Mapオブジェクト
	 */
	my.map = spec.map;

	my.olcontrols = [],
    
    /**
     * メニュー初期化
     */
	that.init = function(){
		var controls = [
						gis.ui.control.mousePosition({map : my.map}),
						gis.ui.control.scaleView({map : my.map})
		                ];
		
        var contentid = "statuscontents";
        var html = "<table><tr id='" + contentid + "'></tr></table>";
        $("#" + my.divid).append(html);
        
        for (var i = 0 in controls){
        	var ctrl = controls[i];
        	ctrl.initforStatus(contentid);
        }
	};
	
	
	
	that.CLASS_NAME =  "gis.ui.statusbar";
	return that;
};