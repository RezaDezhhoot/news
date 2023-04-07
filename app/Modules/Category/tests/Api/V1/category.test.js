const {app,expect,mongoose,request , utils} = require('../../../../../../testCase');

const {categoryRouterV1} = require('../../../Routes/api');

const User = require('../../../../User/Models/User');
const Category = require('../../../Models/Category');
let user;

app.use(categoryRouterV1);

beforeAll(async () => {
    user = await User.factory();
    await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
    await Category.deleteMany();
});

afterAll(async () => {
    await Category.deleteMany();
    await User.findByIdAndRemove(user._id);
    await mongoose.connection.close();
});

describe('/Get categories',  function() {
    it('it should GET all the categories', async function() {
        await Category.factory();
        await Category.factory();

        const res = await request(app).get("/").set({
            "authorization": 'Bearer '+utils.makeToken(user)
        })
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.categories).toBeDefined();
    });
});
