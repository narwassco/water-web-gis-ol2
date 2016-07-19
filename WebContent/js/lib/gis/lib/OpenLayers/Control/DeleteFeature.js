/**
 * フィーチャ削除コントロール
 */
OpenLayers.Control.DeleteFeature = OpenLayers.Class(OpenLayers.Control, {

	/**
	 * 削除対象のジオメトリタイプ
	 * {Array(String)} 指定した場合は対象のジオメトリに対してのみ削除を行う。
	 * geometryTypesにはOpenLayers.Geometry以下の名前空間を配列で列挙する。
	 */
	geometryTypes : null,

	/**
	 * コンストラクタ
	 * @param layer 操作対象となるレイヤ名
	 * @param options オプション。displassClass,titleなどのキーと値のマップ。
	 * options.geometryTypesを指定した場合は対象のジオメトリに対してのみ削除を行う。
	 */
	initialize : function(layer, options) {
		OpenLayers.Control.prototype.initialize.apply(this, [ options ]);
		this.layer = layer;
		this.handler = new OpenLayers.Handler.Feature(this, layer, {
			click : this.clickFeature
		});
		if (options && options.geometryTypes){
			this.geometryTypes = options.geometryTypes;
		}
	},

	/**
	 * フィーチャクリック時のイベント
	 * @param feature クリックしたフィーチャ
	 */
	clickFeature : function(feature) {
		if (this.geometryTypes){
			//オプションとしてジオメトリタイプが指定されていたら削除対象のフィーチャにフィルタをかける
			if(OpenLayers.Util.indexOf(this.geometryTypes,feature.geometry.CLASS_NAME) == -1) {
				return;
			}
		}

		// if feature doesn't have a fid, destroy it
		if (feature.fid == undefined) {
			this.layer.destroyFeatures([ feature ]);
		} else {
			this.layer.events.triggerEvent("beforefeaturemodified", {
				feature : feature
			});
			feature.state = OpenLayers.State.DELETE;
			this.layer.events.triggerEvent("afterfeaturemodified", {
				feature : feature
			});
			feature.renderIntent = "select";
			this.layer.drawFeature(feature);
		}
	},

	/**
	 * OpenLayers.Mapオブジェクトの設定
	 * @param map OpenLayers.Mapオブジェクト
	 */
	setMap : function(map) {
		this.handler.setMap(map);
		OpenLayers.Control.prototype.setMap.apply(this, arguments);
	},
	CLASS_NAME : "OpenLayers.Control.DeleteFeature"
});