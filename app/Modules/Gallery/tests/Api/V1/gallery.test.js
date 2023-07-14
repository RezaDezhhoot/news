const {app,expect,mongoose,request , utils, redis_flush} = require('../../../../../../testCase');

const {galleryRouterV1} = require('../../../Routes/api');

const Gallery = require('../../../Models/Gallery');
const Category = require('../../../../Category/Models/Category');
let user;

app.use(galleryRouterV1);

beforeAll(async () => {
    await redis_flush();
    await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
    await Category.deleteMany();
    await Gallery.deleteMany();
});

afterAll(async () => {
    await Category.deleteMany();
    await Gallery.deleteMany();
    await mongoose.connection.close();
});

describe('/Get galleries',  function() {
    it('it should GET all the galleries', async function() {
        const category = await Category.factory();
        await Gallery.factory(category._id);

        const res = await request(app).get(`/?category=${category._id}`)
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.galleries).toBeDefined();
    });
});
