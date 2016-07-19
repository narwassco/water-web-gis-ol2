/**
 * 正多角形を描画するスーパークラス
 */
gis.ui.control.regular = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);
	
	/**
	 * 地図関係の編集コントロールかどうか
	 */
	my.isOlControl = true;
	
	/**
	 * コンストラクタ
	 */
	my.init = function(){
		var html = my.getHtml();
		my.dialog.create(html,{
			title : 'Draw Regular Feature Option',
			close : function(){
				that.deactivate();
			}
		},my.initUI);
	};
	
	my.getHtml = function(){
		var html = "<ul" +
		"<li>" +
		"<label for='sides" + my.id + "'>Number of Nodes</label>" +
		"<input id='sides" + my.id + "' type='number' min=3 max=99 name='sides' value='5'/>" +
		"</li>" +
		"<li>" +
		"<input type='checkbox' name='irregular' id='irregular" + my.id + "'/>" +
		"<label for='irregular" + my.id + "'>Create Irregular Feature</label>" +
		"</li>" +
		"</ul>";
		return html;
	};
	
	my.initUI = function(){
		$("#sides" + my.id).change(function(){my.control_update(document.getElementById($( this ).attr('id')));});
		$("#irregular" + my.id).click(function(){my.control_update(document.getElementById($( this ).attr('id')));});
	};
	
	/**
	 * オプションツール設定変更時の反映
	 */
	my.control_update = function(){
		var sides = parseInt(document.getElementById("sides" + my.id).value);
        sides = Math.max(3, isNaN(sides) ? 0 : sides);
        my.olControl.handler.sides = sides;
        var irregular =  document.getElementById("irregular" + my.id).checked;
        my.olControl.handler.irregular = irregular;
	};
	
	/**
	 * コントロールがアクティブになった後の処理（オプション用）
	 */
	my.afterActivate = function(){
		my.init();
		my.dialog.open();
	};
	
	/**
	 * コントロールが非アクティブになった後の処理
	 */
	my.afterDeactivate = function(){
		my.dialog.close();
	};
	
	that.CLASS_NAME =  "gis.ui.control.regular";
	return that;
};