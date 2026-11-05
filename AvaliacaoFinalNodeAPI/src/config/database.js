import { Sequelize } from 'sequelize'

class Database {
    constructor(){
        this.init()
    }

    init(){
        this.db = new Sequelize({
            database: 'exemplodb_ij8o',
            dialect: 'postgres',
            username: 'digooow',
            password: 'yzgTherZd5XaDOtpxNzk8hWr49TUEkGy',
            host: 'dpg-dbh78em7bikc73ff7680-a.oregon-postgres.render.com',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            }
        })
    }

}

export default new Database()