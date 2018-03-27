var PORT    = 38090;
var express = require('express');
var fs      = require("fs");
var path    = require('path');
var app     = express();

app.use(express.static(path.join(__dirname, '/')));

app.listen(PORT, function() {   //监听http://127.0.0.1:3000端口
    console.log("server start:http://127.0.0.1:"+PORT);
});
