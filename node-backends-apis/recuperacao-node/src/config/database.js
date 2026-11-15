import { Sequelize } from 'sequelize'

class Database {
    constructor() {
        this.init()
    }

    init(){
        this.db = new Sequelize({
            database: process.env.DB_NAME || 'exemplodb_ij8o',
            dialect: 'postgres',
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '',
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 5432,
            dialectOptions: process.env.DB_SSL === 'true' ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            } : {}
        })
    }
}

export default new Database()
