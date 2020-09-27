
var SerialPort = require('serialport');

SerialPort.list(function (err, ports) {
	if (err) throw err;

	ports.forEach(function(port) {
		console.log(port);
		/*
		console.log(port.comName);
		console.log(port.pnpId);
		console.log(port.manufacturer);
		*/
	});
});
