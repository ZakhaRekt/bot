const User = require("../../data/user.js");

module.exports = async(oldState,newState) => {
	if(newState.member.user.bot) return; //Если бот то выходим.
    if(newState.member.roles.cache.some(role => role.id === "708688299467997266")) return; //Если есть роли мута то выходим.
    if(newState.channel != null) {
        User.findOne({userID: newState.member.id},(err,data) => {
            if(err) console.log(err);
            if(!data) {
                return; //Если нет отклика от БД то выходим.
            }
            data.joinTime = Date.now(); //Записываем время захода в канал.
            return data.save();
        });

    }
}