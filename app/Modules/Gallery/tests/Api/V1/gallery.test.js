const {app,expect,mongoose,request , utils} = require('../../../../../../testCase');

const {galleryRouterV1} = require('../../../Routes/api');

const User = require('../../../../User/Models/User');
const Gallery = require('../../../Models/Gallery');
const Category = require('../../../../Category/Models/Category');
let user;

app.use(galleryRouterV1);

beforeAll(async () => {
    user = await User.factory();
    await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
    await Category.deleteMany();
    await Gallery.deleteMany();
});

afterAll(async () => {
    await Category.deleteMany();
    await Gallery.deleteMany();
    await User.findByIdAndRemove(user._id);
    await mongoose.connection.close();
});

describe('/Get galleries',  function() {
    it('it should GET all the galleries', async function() {
        const category = await Category.factory();
        await Gallery.factory(category._id);

        const res = await request(app).get(`/?category=${category._id}`).set({
            "authorization": 'Bearer '+utils.makeToken(user)
        })
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.galleries).toBeDefined();
        expect(res.body.data.galleries.length).toBeGreaterThan(0);
    });
});
