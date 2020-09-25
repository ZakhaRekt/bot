const mongoose = require('mongoose');
const schema = mongoose.Schema({
   reportUser: {
      type:String,
   }
});
module.exports = mongoose.model("Report", schema)