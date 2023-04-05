const {Server} = require("socket.io");
const path = require("path");
const appDir = path.dirname(require.main.filename);
const Channel = require('../Modules/Chat/Models/Channel');

module.exports.load = async (server) => {
    const IO = new Server(server, {
        cors: {
            origin: '*',
        }
    });

    const {chatChannelV1} = require(path.join(appDir,'app','Modules/Chat/Routes/channels.js'));

    const channels = await Channel.find({status: true});

    for (const channel of channels) chatChannelV1(IO.of(`/stream/v1/channels/${channel.id}`) , channel);
}