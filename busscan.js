
var modbus = require("./helper_modbus.js");


var app_config = {
	"connect_type": "RTUBuffered",
	"connect_path": "/dev/ttyUSB0",
	"connect_options": {
		"baudRate": 38400
	}
};

var m = new modbus.modbus(app_config);
m.onerror = function(err) {
	console.log("modbus, error:", err.stack || err);
};


m.connect(app_config.connect_type, app_config.connect_path, app_config.connect_options, function() {
	scan();
});

var cid = 1;
var scan = function() {
	if (cid > 255) {
		m.close();
		return;
	}

	m.send_set("writeFC1", cid, 0, 1, function(err) {
		if (err) {
			console.log(cid, "No Client");
		}
		else {
			console.log(cid, "Found");
		}
		cid++;
		scan();
	});
};
