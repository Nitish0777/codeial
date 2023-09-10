//this is communicating with the client side
//browser

class ChatEngine {
	//this will take two thing
	//id and emailId of user
	// [user-chat-box => chatBoxId] , [<%=locals.user._id%> => userEmail]
	constructor(chatBoxId, userEmail) {
		// console.log(chatBoxId, userEmail,'this is both')
		this.chatBox = $(`#${chatBoxId}`);
		// console.log(this.chatBox);
		this.userEmail = userEmail;
		// console.log(this.userEmail);

		//send the connection request
		//io is given by socket which is global variable
		//i emit the connection event
		// console.log(this.socket);
		//http://52.91.226.168:8000/
		this.socket = io.connect(`http://52.91.226.168:5000`); //check is connection received or not
		// console.log(this.socket);
		if (this.userEmail) {
			//if user true then only connection happen
			this.connectionHandler();
		}
	}

	//create connectionHandler
	//this is  two way communication to and for connection establish
	//emit/send back that u are connected
	connectionHandler() {
		let self = this; //this is container full details of the ChatEngine
		console.log(self);
		this.socket.on("connect", function () {
			console.log("connection done using socket...!");

			//room join for emit>send
			// console.log(self.userEmail);
			//client emit that plz lt me join the room
			self.socket.emit("join_room", {
				user_email: self.userEmail,
				chatroom: "codeTalkRoom",
			});
			// console.log(self);

			//receiver only when room created
			//when client join the room server tell to all user who are in room
			self.socket.on("user_joined", function (data) {
				console.log(" a user  joined ");
			});
		});

		//CHANGE: send a message on clicking the send message button
		$("#sends-message").click(function () {
			let msg = $("#chat-message-input").val();

			if (msg != "") {
				//if msg is not empty then i emit/send on the socket
				//with the chatroom name
				self.socket.emit("send_message", {
					message: msg,
					user_email: self.userEmail,
					chatroom: "codeTalkRoom",
				});
			}
		});

		//detect the
		self.socket.on("receive_message", function (data) {
			console.log("message received", data.message);

			let newMessage = $("<li>");
			console.log(newMessage);

			let messageType = "other-message";
			console.log(messageType);

			if (data.user_email == self.userEmail) {
				messageType = "self-message";
			}

			newMessage.append(
				$("<span>", {
					'html': data.message
				})
			);

			newMessage.append(
				$("<sub>", {
					'html': data.user_email
				})
			);

			newMessage.addClass(messageType);

			$("#chat-messages-list").append(newMessage);
		});
	}
}

//to start the chat with user we need to create the room
//send the request and receive the acknowledgment
//when ever the other user came join that room
//you can received the notification that other user join that
