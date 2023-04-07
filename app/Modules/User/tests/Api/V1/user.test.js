const {app,expect,mongoose,request , utils} = require('../../../../../../testCase');
const path = require('path');
const {userRouterV1} = require('../../../Routes/api');

const User = require('../../../../User/Models/User');
let user;

app.use(userRouterV1);

beforeAll(async () => {
    user = await User.factory();
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    await User.deleteMany();
    await mongoose.connection.close();
});

describe('/Get user',  function() {
    it('it should GET user profile', async function() {
        const res = await request(app).get("/").set({
            "authorization": 'Bearer '+utils.makeToken(user)
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.data._id).toBeDefined();
        expect(res.body.data.full_name).toBeDefined();
        expect(res.body.data.phone).toBeDefined();
        expect(res.body.data.image).toBeDefined();
        expect(res.body.data.status).toBeDefined();
        expect(res.body.data.role).toBeDefined();
    });
});

describe('/PATCH user',  function() {
    it('it should update user profile', async function() {
        const res = await request(app).patch("/").set({
                "authorization": 'Bearer '+utils.makeToken(user)
            }).send({
            full_name: 'Reza Dezhhoot',
            password: '1234abc',
            floatingConfirmation: '1234abc',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.data._id).toBeDefined();
        expect(res.body.data.full_name).toBeDefined();
        expect(res.body.data.phone).toBeDefined();
        expect(res.body.data.image).toBeDefined();
        expect(res.body.data.status).toBeDefined();
        expect(res.body.data.role).toBeDefined();
    });
});