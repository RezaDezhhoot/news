const ChatController = require('../Controllers/Api/V1/ChatController');
const Channel = require('../Models/Channel');

module.exports.chatChannelV1 = async (io) => {
    io.on('connection', async  socket => {

        const transport = socket.conn.transport.name; // in most cases, "polling"

        socket.conn.on("upgrade", () => {
            const upgradedTransport = socket.conn.transport.name; // in most cases, "websocket"
        });

        const namespace = socket.nsp.name.split('-')[1];
        const channel = await Channel.findOne({_id:namespace}).exec();

        if (channel && channel.status) {
            console.log(`User connected with id: ${socket.id} in ${channel.title} channel.`);

            socket.on('online' , async (data) => {
                await ChatController.online(io , socket , data , channel);
            });

            socket.on('disconnect', async () => {
                await ChatController.disconnect(io , socket , channel);
            });

            socket.on('sendMessage', async (data) => {
                await ChatController.sendMessage(io , socket , channel , data);
            });

            socket.on('deleteMessage', async (data) => {
                await ChatController.deleteMessage(io , socket , channel , data);
            });

            socket.on('getTypistUsers', async (data) => {
                await ChatController.getTypistUsers(io , socket , channel);
            });

            socket.on('typingFeedback', async (data) => {
                await ChatController.typingFeedback(io , socket , channel , data);
            });

            socket.on('finishTypingFeedback', async (data) => {
                await ChatController.finishTypingFeedback(io , socket , channel , data);
            });
        } else {
            socket.emit('channelNotFound',{
                status: 404
            })
        }

    });

}