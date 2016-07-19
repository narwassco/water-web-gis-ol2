gis.ui.controller.undoredo = function(spec,my){
	my = my || {};
	var that = gis.ui.controller(spec,my);
	
	/**
	 * undo/redo対象のベクタレイヤオブジェクト
	 */
	my.layer = spec.layer;
	
	/**
	 * undo用のスタック
	 */
	my.undostack = [];
	
	/**
	 * redo用のスタック
	 */
	my.redostack = [];
	
	/**
	 * Menuオブジェクト
	 */
	my.menuObj = null;
	
	/**
	 * レイヤ内のフィーチャを全てクローンする
	 */
	my.getFeatureClone = function(features){
		var temp = [];
		for (var i = 0 in features){
			var feature = features[i];
			temp.push(feature.clone());
		}
		return temp;
	};
	
	/**
	 * undo/redoを行う
	 */
	my.undoRedo = function(pushstack,popstack){
		if (my.menuObj !== null){
			my.menuObj.allDeactivate();
		}
		
		var latest = my.getFeatureClone(my.layer.features);
		var poped = popstack.pop();
		if (latest.length > 0){
			pushstack.push(latest);
		}
		my.layer.removeAllFeatures({silent : true});
		my.layer.addFeatures(poped,{silent : true});
	};
	
	/**
	 * Menuオブジェクトを設定
	 */
	that.setMenuObj = function(obj){
		my.menuObj = obj;
	};
	
	/**
	 * 初期化
	 */
	that.init = function(){
		var types = ['beforefeaturesadded','beforefeaturesremoved','beforefeaturemodified'];
		for (var i = 0 in types){
			var type = types[i];
			my.layer.events.register(type,my.layer,that.doStack);
		}
	};
	
	/**
	 * レイヤのフィーチャ全体をスタックに格納する
	 */
	that.doStack = function(isredoclear){
		var features = my.getFeatureClone(my.layer.features);
		my.undostack.push(features);
		my.redostack = [];
	};
	
	/**
	 * レイヤの状態を一つ前に戻す
	 */
	that.undo = function(){
		my.undoRedo(my.redostack,my.undostack);
	};
	
	/**
	 * レイヤの状態を一つ後に進める
	 */
	that.redo = function(){
		my.undoRedo(my.undostack,my.redostack);
	};
	
	that.init();
	
	that.CLASS_NAME =  "gis.ui.controller.undoredo";
	return that;
};