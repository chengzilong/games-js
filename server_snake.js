var koa = require("koa");
var koaStatic = require("koa-static");
var path = require("path");

var app = koa();

app.use(koaStatic(path.resolve(__dirname, ".")));

app.listen(3000, function(){
	console.log("server started on 3000");
})