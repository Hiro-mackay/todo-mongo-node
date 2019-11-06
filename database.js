const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


//'mongodb://localhost:27017'
//myDB
module.exports = class {
    constructor(url, dbName, connectOption = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }) {
        this.url = url;
        this.dbName = dbName;
        this.connectOption = connectOption;
        this.db;
        this.dbClient;

    }

    /**
     * connecting database
     */
    async initConnect() {
        await this.connect();
        await this.disconnect();
    }

    async connect() {
        let dbClient;
        let db;
        try {
            dbClient = await MongoClient.connect(this.url, this.connectOption);
            db = dbClient.db(this.dbName);
        } catch (err) {
            console.log(err.stack);
        }
        this.dbClient = dbClient;
        this.db = db;
    }


    /**
     * disconnect database
     */
    async disconnect() {
        await this.dbClient.close();
        this.dbClient = "";
        this.db = "";
    }


    getDb() {
        return this.db;
    }

    getDbName() {
        return this.dbName;
    }

    getDbClient() {
        return this.dbClient;
    }


    /** initialize collection 
     * 
     * @param {*} db client database object {client,db, collection}
     * 
     */
    async initialDocuments(coll, callback = () => {}) {
        try {
            await this.connect();
            const collection = this.db.collection(coll)
            collection.deleteMany({});
            callback();
        } catch (e) {
            console.log(e);
        } finally {
            if (this.dbClient) {
                this.disconnect();
            }
        }
    }


    /**Create collection
     * 
     * @param {*} collection collection in client database
     * @param {*} data Insert data object
     */
    async insertDocuments(coll, data, callback = () => {}) {
        try {
            await this.connect();
            const collection = this.db.collection(coll);
            if (!Array.isArray(data)) {
                data = [data];
            }
            collection.insertMany(
                data,
                (err, result) => {
                    // assertion test
                    assert.equal(err, null);
                    console.log(`Insert documents into the collection of "${coll}"`);
                    callback(err);
                },
            );
        } catch (e) {
            console.log(e);
        } finally {
            if (this.dbClient) {
                this.disconnect();
            }
        }
    }


    /** Read collection
     * 
     * @param {*} collection collection in client database
     * @param {*} data Find Data object
     */
    async findDocuments(coll, data, callback = () => {}) {
        let foundData;
        try {
            await this.connect();
            const collection = this.db.collection(coll);
            foundData = await collection.find({}).toArray();
        } catch (e) {
            console.log(e);
        } finally {
            if (this.dbClient) {
                this.disconnect();
            }
        }

        return foundData;
    }




    /**Updata collection
     * 
     * @param {*} collection collection in client database
     * @param {*} updataData アップデートする元データ
     * @param {*} targetdata アップデート後のデータ
     */
    async updataDocuments(coll, updataData, targetdata, callback = () => {}) {
        try {
            await this.connect();
            const collection = this.db.collection(coll)
            collection.updateMany(
                updataData,
                targetdata,
                (err, result) => {
                    assert.equal(err, null);
                    console.log('Updata the document with field');
                    callback(err);
                }
            )
        } catch (e) {
            console.log(e);
        } finally {
            if (this.dbClient) {
                this.disconnect();
            }
        }

    }

    /** Delete collection
     * 
     * @param {*} collection collection in client database
     * @param {*} data Delete data object
     */
    async removeDocuments(coll, data, callback = () => {}) {
        try {
            await this.connect();
            const collection = this.db.collection(coll);
            collection.deleteMany(
                data,
                (err, result) => {
                    assert.equal(err, null);
                    console.log('Remove the document with the field');
                    callback(err);
                })
        } catch (e) {
            console.log(e);
        } finally {
            if (this.dbClient) {
                this.disconnect();
            }
        }

    }

}