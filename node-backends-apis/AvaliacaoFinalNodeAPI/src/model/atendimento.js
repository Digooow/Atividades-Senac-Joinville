import database from '../config/database.js'

class Atendimento {
    constructor(){
        this.model = database.db.define("atendimento", {
            id: {
                type: database.db.Sequelize.INTEGER,
                primaryKey:true,
                autoIncrement: true
            },
            data: { type: database.db.Sequelize.STRING },
            valor: {type: database.db.Sequelize.INTEGER },
            concluido: { type: database.db.Sequelize.BOOLEAN}
        })
    }
}

export default new Atendimento().model
