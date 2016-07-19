/**
 * スナッピングツール
 */
gis.ui.control.snapping = function(spec, my) {
	my = my || {};

	var that = gis.ui.control(spec, my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'snapping';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Snapping Setting';

	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = new OpenLayers.Control.Snapping({
		layer: my.editingLayer,
		targets: [my.editingLayer],
        greedy: false
	});
	
	my.dialog = gis.ui.dialog({ divid : my.id });
	
	/**
	 * コンストラクタ
	 */
	my.init = function(){
		var html = my.getHtml();
		my.dialog.create(html,{
			title : 'Snapping Option',
			close : function(){
				my.olControl.deactivate();
			}
		},my.initUI);
	};
	
	my.getHtml = function(){
		var types = ["node", "vertex", "edge"];
		var typenms = ["node","vertex","edge"];
		
		var html = "<table>";
		for (var i = 0 in types){
			var type = types[i];
			var name = typenms[i];
			var id = my.id + "_" + type;
			html += "<tr>" +
			"<td><input type='checkbox' id='" + id + "'/></td>" +
			"<td><label for='" + id + "'>" + name + "</label>" +
			"<td><input type='number' id='" + id + "Tolerance' class='gis-ui-control-snapping-txtnumber'/></td>" +
			"<td><label for='" + id + "'>px</label></td>" +
			"</tr>";
		}
		html += "</table>";
		return html;
	};
	
	/**
	 * UI設定コントロールの初期化
	 */
	my.initUI = function(){
		that.addControlInMap(my.map);
		
		var types = ["node", "vertex", "edge"];
		for (var i = 0 in my.olControl.targets){
			var target = my.olControl.targets[i];
			for (var j = 0 in types){
				var type = types[j];
				var tog = document.getElementById(my.id + "_" + type);
                tog.checked = target[type];
                tog.onclick = (function(tog, type, target) {
                    return function() {target[type] = tog.checked;};
                })(tog, type, target);
                tol = document.getElementById(my.id + "_" + type + "Tolerance");
                tol.value = target[type + "Tolerance"];
                tol.onchange = (function(tol, type, target) {
                    return function() {
                        target[type + "Tolerance"] = Number(tol.value) || 0;
                    };
                })(tol, type, target);
			};
		};
	};
	
	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		my.init();
		if (!my.editingLayer){
			return;
		}
		my.olControl.activate();
		my.dialog.open();

	};
	
	that.CLASS_NAME = "gis.ui.control.snapping";
	return that;
};