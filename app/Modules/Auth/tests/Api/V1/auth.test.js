const {app,expect,mongoose,request , utils} = require('../../../../../../testCase');

const {routerV1} = require('../../../Routes/api');

const User = require('../../../../User/Models/User');
const Token = require('../../../../User/Models/Token');
let testUser ;

app.use(routerV1);

beforeAll(async () => {
    testUser = await User.factory();
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    await User.deleteMany();
    await Token.deleteMany();
    await mongoose.connection.close();
});

describe('/Post login',  function() {
    it('user can login', async function() {
        const res = await request(app).post("/login").send({
            phone: testUser.phone,
            password: '1234'
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.data._id).toBeDefined();
        expect(res.body.data.full_name).toBeDefined();
        expect(res.body.data.phone).toBeDefined();
        expect(res.body.data.role).toBeDefined();
        expect(res.body.data.token).toBeDefined();
    });
});

describe('/Post register',  function() {
    it('user can register', async function() {
        const user = {
            full_name: 'name',
            phone: `09${utils.getRandomIntInclusive(100000000,999999999)}`,
            password: '1234abc',
            floatingConfirmation: '1234abc',
        };
        const tokenRes = await request(app).post("/register/get-token").send({
            phone: user.phone,
        });
        expect(tokenRes.statusCode).toBe(201);
        expect(tokenRes.body.data).toBeDefined();
        expect(tokenRes.body.data.phone).toBeDefined();
        expect(tokenRes.body.data.value).toBeDefined();
        expect(tokenRes.body.data.expires_at).toBeDefined();

        const verifyRes = await request(app).post("/register/verify-token").send({
            phone: user.phone,
            code: tokenRes.body.data.value,
        });
        expect(verifyRes.statusCode).toBe(200);
        expect(tokenRes.body.data).toBeDefined();
        expect(tokenRes.body.data.phone).toBeDefined();

        const registerRes = await request(app).post("/register").send(user);
        expect(registerRes.statusCode).toBe(201);
        expect(registerRes.body.data).toBeDefined();
        expect(registerRes.body.data._id).toBeDefined();
        expect(registerRes.body.data.full_name).toBeDefined();
        expect(registerRes.body.data.phone).toBeDefined();
        expect(registerRes.body.data.role).toBeDefined();
        expect(registerRes.body.data.token).toBeDefined();
    });
});

describe('Forget password',  function() {
    it('user can reset its password', async function() {
        const user = await User.factory();
        const tokenRes = await request(app).post("/forget-password").send({
            phone: user.phone,
        });
        expect(tokenRes.statusCode).toBe(201);
        expect(tokenRes.body.data).toBeDefined();
        expect(tokenRes.body.data.phone).toBeDefined();
        expect(tokenRes.body.data.value).toBeDefined();
        expect(tokenRes.body.data.expires_at).toBeDefined();

        const resetRes = await request(app).patch("/reset-password").send({
            phone: user.phone,
            code: tokenRes.body.data.value,
            password: 'abc1234',
            floatingConfirmation: 'abc1234',
        });
        expect(resetRes.statusCode).toBe(200);
    });
});