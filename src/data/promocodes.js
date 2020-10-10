const mongoose = require('mongoose');
const schema = mongoose.Schema({
    name: String,
    owner: {type: String, default: ""},
    amountUses: { type: Number, default: 0 },
    coinsPerUse: { type: Number, default: 0 },
    promoUsers: { type: Array, default: [] },
    promoLevel: { type: Number, default: 1 },
    IsPromoUser: { type:Number, default: -1 }
});
module.exports = mongoose.model("Promo", schema)