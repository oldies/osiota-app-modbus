
var modbus = require("./helper_modbus.js");

var map_value = function(datatype, data) {
	if (datatype == "uint16") {
		return data[0];
	}
	else if (datatype == "boolean") {
		return data[0] != 0;
	}
	return data[0];
};

var remap_value = function(datatype, value) {
	if (datatype == "uint16") {
		return [ value*1 ];
	}
	else if (datatype == "boolean") {
		return [ value*1 ];
	}
	return [ value*1 ];
};

exports.init = function(node, app_config, main, host_info) {

	var baudrate = 38400;

	var models = {};

	if (typeof app_config !== "object") {
		app_config = {};
	}
	if (typeof app_config.connect_type !== "string") {
		throw new Error("Modbus: connect_type not defined");
	}
	if (typeof app_config.connect_path !== "string") {
		throw new Error("Modbus: connect_path not defined");
	}

	if (typeof app_config.devices !== "object" ||
			!Array.isArray(app_config.devices)) {
		throw new Error("Modbus: Devices not defined.");
	}

	if (typeof app_config.models === "object") {
		for (var cn in app_config.models) {
			models[cn] = app_config.models[cn];
		}
	}

	var map = node.map(app_config.map || [], null, true);

	var _this = this;

	var m = new modbus.modbus(app_config);
	m.onerror = function(err) {
		console.log("modbus, error:", err.stack || err);

		if (err.message == "Timed out")
			return false;

		// err.message == "Port Not Open"

		if (this.close)
			this.close();

		_this._reinit_delay(5000);
		return true;
	};

	var get_model = function(d) {
		if (typeof d.client === "object") {
			return d.client;
		}
		if (typeof d.model === "string" &&
				typeof models[d.model] === "object") {
			return models[d.model];
		}
		if (typeof d.address !== "undefined" &&
				typeof d.name === "string") {
			var v = {};
			v[d.name] = d;
			return v;
		}
		throw new Error("Modbus: Client config not found.");
	}

	var map_itemtype = function(type) {
		if (typeof type !== "string")
			return "output boolean";
		if (type.match(/FC1/i))
			return "output boolean";
		if (type.match(/FC2/i))
			return "input boolean";
		if (type.match(/FC3/i))
			return "output register";
		if (type.match(/FC4/i))
			return "input register";

		if (type.match(/coil/))
			return "output boolean";
		if (type.match(/holding/))
			return "output register";
		if (type.match(/output/) && type.match(/register/))
			return "output register";
		if (type.match(/output/))
			return "output boolean";
		if (type.match(/input/) && type.match(/register/))
			return "input register";
		if (type.match(/input/))
			return "input boolean";
		return "output boolean";
	};

	var create_er_binding = function(item, command, cid, prefix, nodename) {
		var n = map.node(prefix+nodename);
		n.announce(item.meta);

		var lenth = 1;
		if (item.hasOwnProperty("length")) {
			length = item.length;
		} else {
			var tmp = remap_value(item.datatype, 0);
			length = tmp.length;
		}

		if (!item.ignore) {
			// TODO: length aus datatype ermitteln.
			m.client_add(command, cid, {
				"address": item.address || 0,
				"length": length || 1,
				"callback": function(data) {
					var value = map_value(item.datatype, data);
					if (item.erase && value) {
						// uninitialized?
						if (n.value === null) {
							// ignore value:
							value = null;
						}
						var ndata = remap_value(item.datatype, 0);
						m.client_set(command, cid, item.address, ndata);
					}
					n.publish(undefined, value, true);
				}
			});
		}
		if (m.client_can_set(command)) {
			if (typeof item.pre_set === "number") {
				var ndata = remap_value(item.datatype, item.pre_set);
				m.client_set(command, cid, item.address, ndata);
			}

			n.rpc_set = function(reply, value) {
				var data = remap_value(item.datatype, value);
				m.client_set(command, cid, item.address, data, function(err) {
					if (err) {
						reply(err, "Error");
					} else {
						reply(null, "okay");
					}
				});
			};
		}

	};

	var id = 1;
	app_config.devices.forEach(function(d) {
		var model = get_model(d);
		var prefix = "";
		if (typeof d.prefix === "string") {
			prefix = d.prefix;
		}
		var cid = id;
		if (typeof d.id === "number") {
			cid = d.id;
		}
		id = cid+1;

		for (var nodename in model) {
			var item = model[nodename];
			var command = map_itemtype(item.type);

			create_er_binding(item, command, cid, prefix, nodename);
		}
	});

	// open connection to a port
	m.connect(app_config.connect_type, app_config.connect_path, app_config.connect_options);

	return [map, m];
};
