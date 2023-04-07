const {app,expect,mongoose,request , utils} = require('../../../../../../testCase');

const {articleRouterV1} = require('../../../Routes/api');

const User = require('../../../../User/Models/User');
const Article = require('../../../Models/Article');
let user;

app.use(articleRouterV1);

beforeAll(async () => {
    user = await User.factory();
    await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
    await Article.deleteMany();
});

afterAll(async () => {
    await Article.deleteMany();
    await User.findByIdAndRemove(user._id);
    await mongoose.connection.close();
});


describe('/Get articles',  function() {
    it('it should GET all the articles', async function() {
        await Article.factory();
        await Article.factory();

        const res = await request(app).get("/").set({
            "authorization": 'Bearer '+utils.makeToken(user)
        })
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.articles).toBeDefined();
        expect(res.body.data.articles.length).toBeGreaterThan(0);
    });
});

describe('/Get article',  function() {
    it('it should GET a article', async function() {
        const article = await Article.factory();
        const res = await request(app).get(`/${article._id}`).set({
            "authorization": 'Bearer '+utils.makeToken(user)
        })
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.title).toBeDefined();
        expect(res.body.data.body).toBeDefined();
        expect(res.body.data.image).toBeDefined();
        expect(res.body.data.created_at).toBeDefined();
    });
});

