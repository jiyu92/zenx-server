var zenx = require('./main.js'),
    path = require('path'),
    config = {
        "db_type": "mongodb",
        "db_host": "mongodb://127.0.0.1:27017/zenx",
        "db_user": "",
        "db_pass": "",
        "bind": "127.0.0.1",
        "port": "10000",
        "https": true,
        "ws": true,
        "isBehindProxy": false,
        "ssl_key": path.resolve(__dirname + "/ssl/ssl.key"),
        "ssl_crt": path.resolve(__dirname + "/ssl/ssl.crt")
    };

global.s = new zx.ZenXManagerServer(config);

global.s.api.core = require('./api/core.js');