import database from '../config/database.js'

class Cliente {
    constructor(){
        this.model = database.db.define("cliente", {
            id: {
                type: database.db.Sequelize.INTEGER,
                primaryKey:true,
                autoIncrement: true
            },
            nome: { type: database.db.Sequelize.STRING },
            email: {type: database.db.Sequelize.STRING },
            senha: { type: database.db.Sequelize.STRING}
        })
    }
}

export default new Cliente().model