this.gistools ={
		map:null,
		settingObj : gis.setting({}),
		toolcontainers : null,
		objLogin : gis.ui.control.login({}),

		init:function(){
			this.settingObj.init();
			OpenLayers.ProxyHost = "cgi-bin/proxy.cgi?url=";
			OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;

			var options = {
					div : 'map',
					maxExtent:this.settingObj.getBounds("MaxExtent"),
					controls : [new OpenLayers.Control.PanZoomBar({zoomWorldIcon : true}),
					            new OpenLayers.Control.Navigation(),
					            new OpenLayers.Control.LayerSwitcher(),
					            new OpenLayers.Control.ScaleLine({'bottomInUnits' : ''}),
					            new OpenLayers.Control.Attribution(),
					            new OpenLayers.Control.OverviewMap()],
					maxScale : 23,
					projection : new OpenLayers.Projection('EPSG:4326'),
					displayProjection : new OpenLayers.Projection('EPSG:4326'),
			};
			this.map = new OpenLayers.Map(options);
			this.map.div.style.backgroundColor = 'rgb(221.238.255)';

			this.setTools();
			this.resizeContainer();

			var bounds = this.settingObj.getBounds("InitialExtent");
			this.map.zoomToExtent(bounds.transform(this.map.displayProjection,this.map.projection));

		},

		setTools : function(){
			var objlayer = new gis.ui.layer({
				map : this.map,
				defineurl : './define.json',
				mapservurl : this.settingObj.getMapServUrl()
			})
			var mapmenu = new gis.ui.mapmenu({
				divid : 'dropdown_container',
				map : this.map
			});
			var btnmenu = new gis.ui.buttonmenu({
				divid : 'btnmenu_container',
				map : this.map
			});
			var statusbar = new gis.ui.statusbar({
				divid : 'statusbar_container',
				map : this.map
			});
			var tools = [objlayer,mapmenu,btnmenu,statusbar];
			for (var i = 0 in tools){
				tools[i].init();
			}
		},

		resizeContainer:function(){
			var map = gistools.map;
			var newsize = map.getSize();

			var reductWidth = 15;
			var reductHeight = 30;
			var idlist = ["dropdown_container","btnmenu_container","menu","statusbar_container"]
			for (var i = 0 in idlist){
				reductHeight += $("#" + idlist[i]).height();
			}

			newsize.w = document.documentElement.clientWidth - reductWidth;
			newsize.h = document.documentElement.clientHeight - reductHeight;
			$("#" + map.div.id).width(newsize.w);
			$("#" + map.div.id).height(newsize.h);
			map.updateSize();
		}
};

$(document).ready(function(){
	gistools.init();
});
$(window).resize(function(){
	gistools.resizeContainer();
});