const mongoose = require('mongoose');
const schema = mongoose.Schema({
	gameName: String,
    leader: String,
    started: { type: Boolean, default: false },
    paused: { type: Boolean, default: false },
    day: { type: Boolean, default: true },
    gamersDescription: { type: Array, default: [] },
    players: { type: Array, default: [] },
    playersNicknames: { type: Map, default: {} },
    fouls: { type: Map, default: {} },
     roles: { type: Array, default: ["Мирный житель","Мирный житель","Доктор","Мафия","Мирный житель","Мирный житель","Дон Мафии","Мирный житель","Мирный житель","Комиссар"] }
});
module.exports = mongoose.model("Mafia", schema)