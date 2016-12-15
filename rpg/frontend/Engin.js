var CoorMap = require("./CoorMap");
var MapEngin = require("./MapEngin");
var CharacterEngin = require("./CharacterEngin.js");
var ScriptEngin = require("./ScriptEngin.js");
var LinesEngin = require("./LinesEngin.js");

// MapEngin 负责地图的加载和dataSource的初始化
// ---
// CharacterEngin 负责监听键盘的事件，方向键控制人物走动，空格和回车开始对话
// ---
// ScriptEngin 负责设定当前剧情，加载当前剧情人物到dataSource中
// ---
// LinesEngin 负责剧情台词的播放，剧情的跳转（Line中实现）

// 整个游戏的dataSource是由MapEngin记载的基本地图数据
// 和ScriptEngin根据剧情加载的人物数据组成的

// 主人公MainCharacter是不随剧情和地图加载的，单独加载

// 游戏全体使用html js css实现
// 前台分为3层，map layer, character layer, lines layer
// 每个层次有一个overlay, 每个层次在展示的时候，该层的overlay会表示出来，接管键盘事件

function Engin(config) {
	this.config = config;
	this.dataSource = new CoorMap();

	this.mapData = null;
	this.mapEngin = null;
	
	this.characterData = null;
	this.characterEngin = null;

	this.scriptData = null;
	this.scriptEngin = null;

	this.linesEngin = null;
}

Engin.prototype = {
	constructor: Engin,

	init: function() {
		var _this = this;
		$.when(this.getInitData()).then(function(result){
			
			_this.mapData = result.mapData;
			_this.mapEngin = new MapEngin(_this);
			_this.mapEngin.init();

			_this.characterData = result.characterData;
			_this.characterEngin = new CharacterEngin(_this);
			_this.characterEngin.init();

			_this.scriptData = result.scriptData;
			_this.scriptEngin = new ScriptEngin(_this);
			_this.scriptEngin.init();

			_this.linesEngin = new LinesEngin(_this);
			_this.linesEngin.init();
		});
	},

	getInitData: function(){
		var deferred = new $.Deferred();
		var _this = this;
		var url = "/init";
		$.ajax(url, {
			method: "get"
		}).then(function(result){
			deferred.resolve(result);
		})
		return deferred;
	},

	// 检测地图切换
	// 检测剧情发生
	checkEvent: function(x, y){
		var changeToMap = this.mapEngin.checkChangeMap(x,y);
		if( changeToMap === false){
			return;
		}

		// 地图切换，加载当前地图人物
		this.scriptEngin.loadCharacter();
	},

	setDataSource: function(dataSource) {
		this.dataSource = dataSource;
	},

	getDataSource: function(){
		return this.dataSource;
	}
}

module.exports=Engin;
