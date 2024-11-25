const mongoose= require("mongoose");
const {db: {host, port, name}} = require('../config');

const connectedURl = `mongodb://${host}:${port}/${name}`;

class Database {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect(connectedURl, {maxPoolSize: 50})
                                                .then(_ => console.log(`Connect Successfully`))
                                                .catch(err => console.log(`Error: ${err}`));
    }

    static getInstance = () => {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instance = Database.getInstance();
module.exports = instance;