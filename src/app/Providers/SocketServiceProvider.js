const {Server} = require("socket.io");
const path = require("path");
const appDir = path.dirname(require.main.filename);

module.exports.load = async (server) => {
    const IO = new Server(server, {
        cors: {
            origin: '*',
        }
    });

    const {chatChannelV1} = require(path.join(appDir,'app','Modules/Chat/Routes/channels.js'));

    chatChannelV1(IO.of(/^\/channel\/v1-[a-f\d]{24}$/i));
}