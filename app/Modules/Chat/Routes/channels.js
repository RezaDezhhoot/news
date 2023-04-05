const ChatController = require('../Controllers/Api/V1/ChatController');

module.exports.chatChannelV1 = async (io , channel) => {
    io.on('connection',  socket => {
        console.log(`User connected with id: ${socket.id} in ${channel.title} channel.`);

        socket.on('online' , async (data) => {
            await ChatController.online(io , socket , data);
        });
        socket.on('disconnect', async () => {
            await ChatController.disconnect(io , socket , channel);
        });
        socket.on('sendMessage', async (data) => {
            await ChatController.sendMessage(io , socket , channel , data);
        });
        socket.on('deleteMessage', async () => {
            await ChatController.deleteMessage(io , socket , channel);
        });
        socket.on('typingFeedback', async () => {
            await ChatController.typingFeedback(io , socket , channel);
        });
    });
}