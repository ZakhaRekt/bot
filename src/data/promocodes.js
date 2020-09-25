const mongoose = require('mongoose');
const schema = mongoose.Schema({
    name: String,
    amountUses: { type: Number, default: 0 },
    coinsPerUse: { type: Number, default: 0 },
    promoUsers: { type: Array, default: [] },
});
module.exports = mongoose.model("Promo", schema)