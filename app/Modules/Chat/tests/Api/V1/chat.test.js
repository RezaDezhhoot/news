const {app,expect,mongoose,request , utils} = require('../../../../../../testCase');

const {chatRouterV1} = require('../../../Routes/api');
const User = require('../../../../User/Models/User');
const Channel = require('../../../Models/Channel');
const Chat = require('../../../Models/Chat');
let user;

app.use(chatRouterV1);

beforeAll(async () => {
    user = await User.factory();
    await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
    await Chat.deleteMany();
    await Channel.deleteMany();
});

afterAll(async () => {
    await Chat.deleteMany();
    await Channel.deleteMany();
    await User.findByIdAndRemove(user._id);
    await mongoose.connection.close();
});

describe('/Get chats',  function() {
    it('it should GET all the chats', async function() {
        const channel = await Channel.factory();
        const res = await request(app).get(`/${channel._id}`).set({
            "authorization": 'Bearer '+utils.makeToken(user)
        })
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.chats).toBeDefined();
    });
});