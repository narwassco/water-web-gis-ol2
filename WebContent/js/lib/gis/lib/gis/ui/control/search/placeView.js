/**
 * WKTを編集レイヤに表示するコントロール
 */
gis.ui.control.search.placeView = function(spec,my){
	my = my || {};

	var that = gis.ui.control.search(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'placeView';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Search Place';

	my.dialog = gis.ui.dialog({ divid : my.id });

	my.tableId = "table-" + my.id;
	my.pagerId = "pager-" + my.id;

	my.height = 510;
	my.width = 930;
	my.url = './rest/Places/';
	my.colModelSettings= [
       {name:"placeid",index:"placeid",width:15,align:"right",classes:"placeid_class"},
       {name:"name",index:"name",width:40,align:"left",classes:"name_class"},
       {name:"category",index:"category",width:30,align:"left",classes:"category_class"},
       {name:"wkt",index:"wkt",width:40,align:"left",classes:"wkt_class"}
   ]
	my.colNames = ["Place ID","Place Name","Category","Location"];

	that.CLASS_NAME =  "gis.ui.control.search.customerView";
	return that;
};