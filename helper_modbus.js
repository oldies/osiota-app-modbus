
var ModbusRTU = require("modbus-serial");

var read_data = function(client_items, address_min, data, buffer) {
	client_items.forEach(function(c) {
		c.callback(data.slice(c.address-address_min,
				c.address-address_min+c.length),
			buffer.slice(2*(c.address-address_min),
				2*(c.address-address_min+c.length)));
	});
};

exports.modbus = function(config) {
	var _this = this;

	this.client = new ModbusRTU();
	if (typeof config !== "object") {
		config = {};
	}
	if (typeof config.packet_timeout !== "number") {
		config.packet_timeout = 1500;
	}
	if (typeof config.packet_delay !== "number") {
		config.packet_delay = 10;
	}
	if (typeof config.circle_delay !== "number") {
		config.circle_delay = 100;
	}

	this.packet_delay = config.packet_delay;
	this.circle_delay = config.circle_delay;
	this.client.setTimeout(config.packet_timeout);
	this.max_payload = 60;
	if (typeof config.max_payload === "number") {
		this.max_payload = config.max_payload;
	}

	this.commands = {
		"output boolean": {
			command_poll: "writeFC1",
			command_set: "writeFC15",
			clients: {}
		},
		"input boolean": {
			command_poll: "writeFC2",
			clients: {}
		},
		"output register": {
			command_poll: "writeFC3",
			command_set: "writeFC16",
			clients: {}
		},
		"input register": {
			command_poll: "writeFC4",
			clients: {}
		}
	};

	this.poll_commands = [];
	this.set_commands = [];

	this.onerror = function(err) {
		console.error("modbus, run:", err.stack || err);
		return false;
	};

	this.pc_id = 0;
};
exports.modbus.prototype.delay = function(next, timeout) {
	this.tid = setTimeout(next.bind(this), timeout);
};

exports.modbus.prototype.run_do = function() {
	if (this.set_commands.length != 0) {
		this.set_commands.shift()(this.run.bind(this));
	} else if (this.poll_commands.length != 0) {
		if (this.pc_id >= this.poll_commands.length) {
			this.delay(this.run, this.circle_delay);
			this.pc_id = 0;
		} else {
			this.poll_commands[this.pc_id](this.run.bind(this));
			this.pc_id++;
		}
	} else {
		// no poll commands
		this.delay(this.run, this.circle_delay);
	}
};
exports.modbus.prototype.run = function() {
	var _this = this;

	if (this.closed)
		return;

	this.delay(this.run_do, this.packet_delay);
};


exports.modbus.prototype.client_add = function(type, cid, config) {
	if (typeof this.commands[type] !== "object") {
		throw new Error("type undefined: " + type);
		return;
	}
	var gid = config.address - (config.address % this.max_payload);
	if (typeof this.commands[type].clients[cid] !== "object" ||
			this.commands[type].clients[cid] === null) {
		this.commands[type].clients[cid] = {"groups": []};
	}
	if (!Array.isArray(this.commands[type].clients[cid].groups[gid])) {
		this.commands[type].clients[cid].groups[gid] = [];
	}

	this.commands[type].clients[cid].groups[gid].push(config);
};

exports.modbus.prototype.client_can_set = function(type) {
	if (typeof this.commands[type] !== "object") {
		throw new Error("type undefined: " + type);
		return;
	}

	var command_set = this.commands[type].command_set;
	if (command_set)
		return true;
	return false;
};

exports.modbus.prototype.client_set = function(type, cid, address, data, ext_callback) {
	if (typeof this.commands[type] !== "object") {
		throw new Error("type undefined: " + type);
		return;
	}

	var _this = this;
	var command_set = this.commands[type].command_set;
	if (!command_set) return;

	this.set_commands.push(function(next) {
		_this.send_set(command_set, cid, address, data, function(err) {
			if (typeof ext_callback === "function")
				ext_callback(err);
			next();
		});
	});
};

exports.modbus.prototype.send_poll = function(command, cid, address, length, client_items, callback) {
	var _this = this;
	if (typeof this.client[command] !== "function") {
		throw new Error("undefined command: " + command);
	}
	var already_called = false;
	this.client[command].call(this.client,
			cid,
			address,
			length,
		function(err, data) {
			if (already_called) {
				console.warn("Warn: Called callback twice. Command: POLL", command, cid, address, data, "\nThis happens after a timeout. Please increase the packet timeout.");
				return;
			}
			already_called = true;

			if (err) {
				err.message += " cmd:"+command+
					" cid:"+cid+
					" addr:"+address+
					" len:"+length+
					" data:"+data;
				//console.log("[poll] Modbus-Error ("+cid+"):", err);
				if (_this.onerror(err))
					return;
			} else {
				read_data(client_items, address, data.data, data.buffer);
			}
			callback();
		}
	);
};
exports.modbus.prototype.send_set = function(command, cid, address, data, callback) {
	var _this = this;
	if (typeof this.client[command] !== "function") {
		throw new Error("undefined command: " + command);
	}
	var already_called = false;
	this.client[command].call(this.client,
			cid,
			address,
			data,
		function(err, new_data) {
			if (already_called) {
				console.warn("Warn: Called callback twice. Command: SET", command, cid, address, data, "\nThis happens after a timeout. Please increase the packet timeout.");
				return;
			}
			already_called = true;

			if (err) {
				err.message += " cmd:"+command+
					" cid:"+cid+
					" addr:"+address+
					" data:"+data;
				//console.log("[set] Modbus-Error ("+cid+"):", err);
				if (_this.onerror(err))
					return;
			}
			callback(err);
		}
	);
};

// open connection to a port
exports.modbus.prototype.connect = function(connect_type, path, options,
		callback) {
	var _this = this;

	if (typeof this.client["connect" + connect_type] !== "function") {
		throw new Error("Modbus: connect type unknown");
	}
	this.client["connect"+connect_type](path, options, function(err) {
		if (err) {
			if (_this.onerror(err))
				return;
		}

		_this.client._port.on("error", _this.onerror);

		// start run:
		_this.run();

		if (typeof callback === "function") {
			callback();
		}
	});

	this.poll_commands = [];
	for (let type in this.commands) {
	for (let cid in this.commands[type].clients) {
	for (let gid in this.commands[type].clients[cid].groups) {
		let address_min = null;
		let address_max = null;
		this.commands[type].clients[cid].groups[gid].
				forEach(function(c) {
			if (address_min === null || c.address < address_min) {
				address_min = c.address;
			}
			if (address_max === null || c.address+c.length > address_max) {
				address_max = c.address+c.length;
			}
		});
		// TODO: Besser optimieren.
		//commands[type].clients[cid].address = address_min;
		//commands[type].clients[cid].length = address_max-address_min;

		let command = this.commands[type].command_poll;
		let address = address_min;
		let length = address_max-address_min;
		let client_items = this.commands[type].clients[cid].groups[gid];

		this.poll_commands.push(function(next) {
			_this.send_poll(
				command,
				+cid,
				address_min,
				length,
				client_items,
				next
			);
		});
	}
	}
	}

};

exports.modbus.prototype.close = function() {
	var _this = this;

	this.closed = true;
	this.poll_commands = [];
	this.set_commands = [];
	if (this.tid)
		clearTimeout(this.tid);

	try {
		this.client.close();
	} catch(err) {
	}
};
