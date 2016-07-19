gis.ui.controlloader = function(spec,my){
	my = my || {};

	var that = gis.ui(spec,my);

	my.divid = spec.divid;

	my.parent = spec.parent;

	my.controlList = {
			"none" : {"class" : gis.ui.control.none},
			"zoomBox" : {"class" : gis.ui.control.zoomBox},
			"selectFeature" : {"class" : gis.ui.control.selectFeature, editingLayer : my.parent.editingLayer},
			"reportLeakage" : {"class" : gis.ui.control.reportLeakage, isMap : true},
			"selectWorksheet" : {"class" : gis.ui.control.selectWorksheet, editingLayer : my.parent.worksheetLayer},
			"inputWorksheet" : {"class" : gis.ui.control.inputWorksheet, editingLayer : my.parent.editingLayer, worksheetLayer : my.parent.worksheetLayer},
			"drawPoint" : {"class" : gis.ui.control.drawPoint, editingLayer : my.parent.editingLayer},
			"drawLine" : {"class" : gis.ui.control.drawLine, editingLayer : my.parent.editingLayer},
			"drawPolygon" : {"class" : gis.ui.control.drawPolygon, editingLayer : my.parent.editingLayer},
			"regular.exterior" : {"class" : gis.ui.control.regular.exterior, editingLayer : my.parent.editingLayer},
			"drawHole" : {"class" : gis.ui.control.drawHole, editingLayer : my.parent.editingLayer},
			"regular.interior" : {"class" : gis.ui.control.regular.interior, editingLayer : my.parent.editingLayer},
			"splitLine" : {"class" : gis.ui.control.splitLine, editingLayer : my.parent.editingLayer},
			"splitPolygon" : {"class" : gis.ui.control.splitPolygon, editingLayer : my.parent.editingLayer},
			"modifyFeature" : {"class" : gis.ui.control.modifyFeature, editingLayer : my.parent.editingLayer},
			"deleteFeature" : {"class" : gis.ui.control.deleteFeature, editingLayer : my.parent.editingLayer},
			"topology" : {"class" : gis.ui.control.topology, editingLayer : my.parent.editingLayer, isMap : true},
			"snapping" : {"class" : gis.ui.control.snapping, editingLayer : my.parent.editingLayer, isMap : true},
			"clearAll" : {"class" : gis.ui.control.clearAll, editingLayer : my.parent.editingLayer},
			"union" : {"class" : gis.ui.control.union, editingLayer : my.parent.editingLayer},
			"intersection" : {"class" : gis.ui.control.intersection, editingLayer : my.parent.editingLayer},
			"difference" : {"class" : gis.ui.control.difference, editingLayer : my.parent.editingLayer},
			"symdifference" : {"class" : gis.ui.control.symdifference, editingLayer : my.parent.editingLayer},
			"buffer" : {"class" : gis.ui.control.buffer, editingLayer : my.parent.editingLayer},
			"undo" : {"class" : gis.ui.control.undo,controller : my.parent.undoredoController},
			"redo" : {"class" : gis.ui.control.redo,controller : my.parent.undoredoController},
			"graticule" : {"class" : gis.ui.control.graticule ,isMap : true},
			"export" : {"class" : gis.ui.control['export'], editingLayer : my.parent.editingLayer},
			"import" : {"class" : gis.ui.control.import, editingLayer : my.parent.editingLayer, isMap : true},
			"measure.calcDistance" : {"class" : gis.ui.control.measure.calcDistance},
			"measure.calcArea" : {"class" : gis.ui.control.measure.calcArea},
			"uploadBillingData" : {"class" : gis.ui.control.uploadBillingData},
			"uncapturedMeter" : {"class" : gis.ui.control.uncapturedMeter},
			"differentVillageMeter" : {"class" : gis.ui.control.differentVillageMeter},
			"mreadingSheet" : {"class" : gis.ui.control.mreadingSheet},
			"search.customerView" : {"class" : gis.ui.control.search.customerView, isMap : true},
			"search.placeView" : {"class" : gis.ui.control.search.placeView, isMap : true},
			"zoomToExtent.naroktown" : {"class" : gis.ui.control.zoomToExtent.naroktown, isMap : true},
			"zoomToExtent.ololulunga" : {"class" : gis.ui.control.zoomToExtent.ololulunga, isMap : true},
			"zoomToExtent.kilgoris" : {"class" : gis.ui.control.zoomToExtent.kilgoris, isMap : true},
			"zoomToExtent.lolgorien" : {"class" : gis.ui.control.zoomToExtent.lolgorien, isMap : true},
			"menuZoomToVillage" : {"class" : gis.ui.control.zoomToVillage, isMap : true, id : "menuZoomToVillage"},
			"btnZoomToVillage" : {"class" : gis.ui.control.zoomToVillage, isMap : true, id : "btnZoomToVillage"},
			"printMap" : {"class" : gis.ui.control.printMap, isMap : true},
			};

	/**
	 * ダイアログを開く
	 */
	that.getControl = function(name){
		if (!my.controlList[name]){
			alert("Class Name=" + name + " is not registered system.");
			return null;
		}
		var control = my.controlList[name];
		var options = {};
		if (control["isMap"] === true){
			options["map"] = my.parent.map;
		}
		if (control["editingLayer"]){
			options["editingLayer"] = control.editingLayer;
		}
		if (control["worksheetLayer"]){
			options["worksheetLayer"] = control.worksheetLayer;
		}
		if (control["controller"]){
			options["controller"] = control.controller;
		}
		if (control["id"]){
			options["id"] = control.id;
		}
		return control["class"](options);
	};

	that.CLASS_NAME =  "gis.ui.controlloader";
	return that;
};