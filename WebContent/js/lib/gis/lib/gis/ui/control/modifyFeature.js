/**
 * 図形を編集するコントロール
 */
gis.ui.control.modifyFeature = function(spec,my){
	my = my || {};

	var that = gis.ui.control(spec,my);
	
	/**
	 * コントロールのID
	 */
	my.id = spec.id || 'modifyFeature';
	
	/**
	 * コントロールの表示名
	 */
	my.label = spec.label || 'Modify Feature';
	
	/**
	 * OpenLayersの地図コントロールオブジェクト
	 */
	my.olControl = new OpenLayers.Control.ModifyFeature(my.editingLayer);
	
	/**
	 * 地図関係の編集コントロールかどうか
	 */
	my.isOlControl = true;
	
	my.dialog = gis.ui.dialog({ divid : my.id });
	
	/**
	 * コンストラクタ
	 */
	my.init = function(){
		var html = my.getHtml();
		my.dialog.create(html,{
			title : 'Modify Option',
			close : function(){
				that.deactivate();
			}
		},my.initUI);
	};
	
	my.getHtml = function(){
		var html = "<ul>" +
		"<li>" +
		"<input type='checkbox' name='createVertices' id='createVertices' checked/>" +
		"<label for='createVertices'>Add Node</label>" +
		"</li>" +
		"<li>" +
		"<input type='checkbox' name='rotate' id='rotate'/>" +
		"<label for='rotate'>Rotate</label>" +
		"</li>" +
		"<li>" +
		"<input type='checkbox' name='resize' id='resize'/>" +
		"<label for='resize'>Resize</label>" +
		"<br>" +
		"<input type='checkbox' name='keepAspectRatio' id='keepAspectRatio' checked/>" +
		"<label for='keepAspectRatio'>Keep Aspect Ratio</label>" +
		"</li>" +
		"<li>" +
		"<input type='checkbox' name='drag' id='drag'/>" +
		"<label for='drag'>Drag</label>" +
		"</li>" +
	"</ul>";
		return html;
	};
	
	my.initUI = function(){
		$("#createVertices").click(function(){my.control_update(document.getElementById($( this ).attr('id')));});
		$("#rotate").click(function(){my.control_update(document.getElementById($( this ).attr('id')));});
		$("#resize").click(function(){my.control_update(document.getElementById($( this ).attr('id')));});
		$("#keepAspectRatio").click(function(){my.control_update(document.getElementById($( this ).attr('id')));});
		$("#drag").click(function(){my.control_update(document.getElementById($( this ).attr('id')));});
	};
	
	/**
	 * オプションツール設定変更時の反映
	 */
	my.control_update = function(){
		// reset modification mode
		my.olControl.mode = OpenLayers.Control.ModifyFeature.RESHAPE;
        var rotate = document.getElementById("rotate").checked;
        if(rotate) {
        	my.olControl.mode |= OpenLayers.Control.ModifyFeature.ROTATE;
        }
        var resize = document.getElementById("resize").checked;
        if(resize) {
        	my.olControl.mode |= OpenLayers.Control.ModifyFeature.RESIZE;
            var keepAspectRatio = document.getElementById("keepAspectRatio").checked;
            if (keepAspectRatio) {
            	my.olControl.mode &= ~OpenLayers.Control.ModifyFeature.RESHAPE;
            }
        }
        var drag = document.getElementById("drag").checked;
        if(drag) {
        	my.olControl.mode |= OpenLayers.Control.ModifyFeature.DRAG;
        }
        if (rotate || drag) {
        	my.olControl.mode &= ~OpenLayers.Control.ModifyFeature.RESHAPE;
        }
        my.olControl.createVertices = document.getElementById("createVertices").checked;
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
	
	that.CLASS_NAME =  "gis.ui.control.modifyFeature";
	return that;
};