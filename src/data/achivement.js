const mongoose = require('mongoose');
const schema = mongoose.Schema({
    userID: String,
    one: { type: Boolean, default: false },
    two: { type: Boolean, default: false },
    three: { type: Boolean, default: false },
    four: { type: Boolean, default: false },
});
module.exports = mongoose.model("Achive", schema)