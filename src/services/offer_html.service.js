var Offer_html = require("../models/offer_html");

//CRUD operations
exports.create_offer_html = async (data) => {
    const offer_html = new Offer_html(data);
    offer_html.save();
    return offer_html;
}

exports.delete_offer_html = async (_id) => {
    const output = await Offer_html.deleteOne({_id: _id});
    return output;
}

exports.get_offer_html = async (filter) => {
    const offer_html = await Offer_html.findOne(filter);
    return offer_html;
}

exports.update_offer_html = async (filter, data) => {
    const output = await Offer_html.updateOne(filter, {$set: data});
    return output;
}