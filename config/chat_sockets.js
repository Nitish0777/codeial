//this is the observer/server
//receive the network for connection
//chatServer -->(server module pass) -> socketSevere
module.exports.chatSockets = function (socketServer) {
	//io is now one type of server
	let io = require("socket.io")(socketServer, {
		allowEIO3: true,
		cors: {
			origin: "http://localhost:8000",
			methods: ["GET", "POST"],
		},
	}); //node package require in io variable

	/* emit is used to trigger an event
	 on is used to add a callback function
	 that's going to be executed when the event is triggered */

	//this received the connection from where i emit
	//then this emit back  automatically to chat_engine that you are connected
	io.sockets.on("connection", function (socket) {
		//When a new client connects to the server, the function
		// logs a message to the console indicating a new connection
		// was received, along with the socket ID.
		console.log("new connection received", socket.id);

		//when ever the client disconnect
		//an automatic disconnected event fire
		socket.on("disconnect", function () {
			console.log(`socket disconnected!!.`);
		});
		//chat_engine
		//once this connection done then it send back that the signal that i ready 
		//in connected mode
		socket.on("join_room", function (data) {
			//When a client wants to join a chat room, 
			//they will emit a "join_room" event to the server
			// with some data that includes the name of the chat room they want to join.
			console.log("joining request received", data);
			/*

			1.The server receives the "join_room" event from the client.
			2.The server code handles the "join_room" event by executing 
			the function defined for it.
			3.The function joins the socket
			(i.e., the connection between the client and the server)
			to the chat room specified in the data received from 
			the client using the socket.join() method.
			4,The function emits a "user_joined" event to all sockets in 
			the chat room using the io.in() method,
			which sends the data received from the client along with the event.
			This allows all other clients in the chat room to know that 
			a new user has joined.

			*/

			socket.join(data.chatroom);

			io.in(data.chatroom).emit("user_joined", data);
		});

        //CHANGE:: detect send_message and broadcast to everyone in the room
        socket.on('send_message',function(data){
			/*

			When a client emits a "send_message" event with data
			including the chatroom name and message, 
			the socket emits a "receive_message" event to all sockets in the chatroom
			with the received data.
			
			*/
            io.in(data.chatroom).emit('receive_message',data);
        });
	});
};
