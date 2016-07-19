/**
 * 縮尺を取得するコントロール
 */
gis.ui.control.scaleView = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);

	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'scaleView';

	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'View Scale Bar';

	/**
	 * デフォルトのチェック状態
	 */
	my.defaultchecked = false;

	/**
	 * コントロールがアクティブになった後の処理（オプション用）
	 */
	my.afterActivate = function(){
		my.ctrlEnabled();
	};

	/**
	 * コントロールが非アクティブになった後の処理
	 */
	my.afterDeactivate = function(){
		my.ctrlEnabled();
	};

	/**
	 * マウス位置表示用のフィーチャオブジェクト
	 */
	my.labelfeature = null;

	/**
	 * 縮尺変更時のコールバック関数
	 */
	my.scale_changed = function(e){
		$("#" + my.id + "_scale").val(parseInt(my.map.getScale()));
	};

	my.dialog = gis.ui.dialog({ divid : my.id });

	/**
	 * コンストラクタ
	 */
	my.init = function(){
		var html = my.getHtml();
		my.dialog.create(html,{
			title : my.label,
			close : function(){
				my.map.events.unregister("zoomend", my.map, my.scale_changed);
			}
		});
	};

	my.getHtml = function(){
		var html = "<table>" +
		"<tr>" +
				"<td><label class='gis-ui-control-viewscale-label'>Scale</label></td>" +
				"<td><input type='text' class='gis-ui-control-viewscale-txt' id='" + my.id + "_scale'/></td>" +
		"</tr>" +
		"</table>";
		return html;
	};

	my.getHtmlforStatus = function(){
		var html = "" +
				"<td><label class='gis-ui-control-viewscale-label'>Scale</label></td>" +
				"<td><input type='text' class='gis-ui-control-viewscale-txt' id='" + my.id + "_scale' readonly/></td>";
		return html;
	};

	/**
	 * コントロールクリック・チェック時のコールバック関数
	 */
	my.toggleCallback = function(element){
		my.init();
		my.map.events.register("zoomend", my.map, my.scale_changed);
		my.scale_changed();
		my.dialog.open();
	};

	that.initforStatus = function(divid){
		var html = my.getHtmlforStatus();
		$("#" + divid).append(html);
		my.map.events.register("zoomend", my.map, my.scale_changed);
	};

	that.CLASS_NAME =  "gis.ui.control.scaleView";
	return that;
};