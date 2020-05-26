let udp = require('dgram');

// --------------------creating a udp server --------------------
let server = udp.createSocket('udp4');

// emits when any error occurs
server.on('error',function(error){
    console.log('Error: ' + error);
    server.close();
});


server.on('listening',function(){
	console.log('Server is listening at port ' + server.address().port);
});

//emits after the socket is closed using socket.close();
server.on('close',function(){
	console.log('Socket is closed !');
});

// test

server.bind(8009);

// --------------------------------------------------------------

class Client {
	constructor(ip, port) {
		this.lastRecv = Date.now();
		// this.id = ip + port;
		this.ip = ip;
		this.port = port;
	}
}

const cb = {
	SPING: 0x00,	// 0 - ping from server
	CPING: 0x01,	// 1 - ping from client
	SUPDATE: 0x02,	// 2 - update from the server
	CUPDATE: 0x03,	// 3 - update from a client
	// PLAYER_UPDATE: 4	// 4 - update about the players
};

// --------------------------------------------------------------

let clients = [];

server.on('message',function(msg,info) { // server recv
	// console.log('Data received from client : ' + msg.toString());
	console.log("\n\n||------------------------------------------------");
	console.log('Received %d bytes from %s:%d',msg.length, info.address, info.port);
   
	let isNew = true;
	clients.forEach(c => {
		// console.log(info);
		// console.log(c.ip);
		if (info.address === c.ip && info.port == c.port) {
			isNew = false;
		}
	});

	console.log("cByte:%i", msg[0]);

	if (isNew) {
		clients.push(new Client(info.address, info.port));
		console.log("Added new client");
	}

	switch (msg[0]) {
		case cb.CPING:
			let currentTime = Date.now()%2147483647;
			let clientTime = msg.readInt32LE(1);
			console.log("pinged by %s: | %s", info.address, clientTime);
			console.log("server time:                %i", currentTime);
			console.log("difference:                 %i", currentTime - clientTime);

			let response = Buffer.alloc(5);
			response.writeInt8(cb.CPING);
			response.writeInt32LE(currentTime, 1);

			// server.send(response, info.port,info.address); // send cPing back
			server.send(msg, info.port,info.address); // send cPing back
	}
	
	// server.send(msg,info.port,info.address,function(error){
	// 	if(error){
	// 		client.close();
	// 	}else{
	// 		console.log('Data sent !!!');
	// 	}
	// });


});

// setTimeout(function(){
	// server.close();
	// },80000);
	
