const Channel = require("../../../Models/Channel");
const ChannelResource = require("../../../Resources/Api/V1/ChannelResource");

module.exports.index = async (req , res) => {
    const page = +req.query.page || 1 , PerPage = +req.query.per_page || 10
    let channels , itemNumbers , options = {$and:[{status: true}]};

    if (req.query.search)
        options.$and.push({title: {$regex: '.*' + req.query.search + '.*'}});

    channels = await Channel.find(options)
        .select(['_id','title','sub_title','image','created_at','color'])
        .sort([['created_at', 'descending']])
        .skip((page-1)*PerPage)
        .limit(PerPage);
    itemNumbers = await Channel.find(options).countDocuments();

    let hasNextPage = PerPage * page < itemNumbers , hasPrePage = page>1 ;

    return res.status(200).json({
        data: {
            channels: ChannelResource.collection(channels),
            meta:{
                currentPage: page,
                nextPage: hasNextPage ? page + 1 : undefined,
                prePage: hasPrePage ? page-1 : undefined,
                lastPage: Math.ceil(itemNumbers/PerPage),
                hasNextPage,
                hasPrePage,
            }
        },
        message: req.__('general.success')
    });
}

module.exports.show = async (req , res) => {
    let data = {} , message = req.__('general.success') , status = 200;
    try {
        const channel = await Channel.findOne({$and: [
                {_id: req.params.id},
                {status: true}
            ]
        });
        if (! channel) {
            message = req.__('general.not_found');
            status = 404;
        } else data = ChannelResource.make(channel);
    } catch (e) {
        message = req.__('general.error');
        status = 500;
    }
    return res.status(status).json({data, message});
}