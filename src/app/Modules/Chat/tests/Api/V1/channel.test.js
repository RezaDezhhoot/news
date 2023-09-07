const {app,expect,mongoose,request , utils} = require('../../../../../../testCase');

const {channelRouterV1} = require('../../../Routes/api');

const User = require('../../../../User/Models/User');
const Channel = require('../../../Models/Channel');
let user;

app.use(channelRouterV1);

beforeAll(async () => {
    user = await User.factory();
    await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
    await Channel.deleteMany();
});

afterAll(async () => {
    await Channel.deleteMany();
    await User.findByIdAndRemove(user._id);
    await mongoose.connection.close();
});

describe('/Get channels',  function() {
    it('it should GET all the channels', async function() {
        await Channel.factory();
        await Channel.factory();

        const res = await request(app).get("/").set({
            "authorization": 'Bearer '+utils.makeToken(user)
        })
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.channels).toBeDefined();
    });
});

describe('/Get channel',  function() {
    it('it should GET a channel', async function() {
        const channel = await Channel.factory();
        const res = await request(app).get(`/${channel._id}`).set({
            "authorization": 'Bearer '+utils.makeToken(user)
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.data._id).toBeDefined();
        expect(res.body.data.title).toBeDefined();
        expect(res.body.data.sub_title).toBeDefined();
        expect(res.body.data.created_at).toBeDefined();
        expect(res.body.data.image).toBeDefined();
        expect(res.body.data.color).toBeDefined();
    });
});