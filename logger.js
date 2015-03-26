var log4js = require('log4js'); 

log4js.configure({
appenders: [
   { type: 'console' },
   { type: 'file', filename: "logs/server.log", category: 'SocketWebApp' }
  ]
});

var logger  = log4js.getLogger('SocketWebApp');
logger.setLevel('DEBUG');

Object.defineProperty(exports, "LOG", {
	value:logger,
});