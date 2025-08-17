"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
exports.default = (dbUri, dbName) => {
    const options = {};
    const client = new mongodb_1.MongoClient(dbUri, options);
    let db;
    function reconnect() {
        return __awaiter(this, arguments, void 0, function* (retries = 5, interval = 2000) {
            if (db) {
                console.log('Already connected');
                return;
            }
            if (retries < 1) {
                console.error('Failed to reconnect after all attempts');
                return;
            }
            console.log('Attempting to reconnect...', retries);
            try {
                yield client.connect();
                db = client.db(dbName);
                console.log('Reconnected successfully');
            }
            catch (err) {
                console.error('Reconnect attempt failed, retrying...', err);
                setTimeout(() => reconnect(retries - 1, interval), interval);
            }
        });
    }
    client.on('close', () => {
        console.log('MongoDB connection closed');
        reconnect();
    });
    client.on('reconnect', () => {
        console.log('MongoDB reconnected');
    });
    client.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        reconnect();
    });
    function search(collectionName_1, indexName_1, query_1) {
        return __awaiter(this, arguments, void 0, function* (collectionName, indexName, query, sort = {}, skip = 0, limit = 25) {
            if (!db) {
                yield reconnect();
            }
            const q = [
                {
                    '$search': {
                        'index': indexName,
                        'text': {
                            'query': `{ $text: { $search: ${query} } }`,
                            'path': {
                                'wildcard': '*'
                            }
                        }
                    }
                },
                {
                    $limit: limit
                },
                {
                    $project: {
                        "_id": 0,
                    }
                }
            ];
            return db.collection(collectionName).aggregate(q).toArray();
        });
    }
    function count(collectionName_1) {
        return __awaiter(this, arguments, void 0, function* (collectionName, query = {}) {
            if (!db) {
                yield reconnect();
            }
            return db.collection(collectionName).countDocuments(query);
        });
    }
    function find(collectionName_1, query_1) {
        return __awaiter(this, arguments, void 0, function* (collectionName, query, options = {}) {
            const { limit, skip, sort, projection } = Object.assign({ projection: {}, sort: {}, skip: 0, limit: 25 }, options);
            if (!db) {
                yield reconnect();
            }
            // for (const key in query) {
            //     if (key.endsWith('_id') && typeof query[key] === 'string') {
            //         query[key] = new ObjectId(query[key])
            //     }
            // }
            return db.collection(collectionName).find(query).project(projection).sort(sort).skip(+skip).limit(+limit).toArray();
        });
    }
    function findOne(collectionName_1, query_1) {
        return __awaiter(this, arguments, void 0, function* (collectionName, query, options = {}) {
            const { projection } = Object.assign({ projection: {} }, options);
            if (!db) {
                yield reconnect();
            }
            return db.collection(collectionName).findOne(query); //.project(projection)
        });
    }
    function aggregate(collectionName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!db) {
                    yield reconnect();
                }
                let collection = db.collection(collectionName);
                const docs = yield collection.aggregate(query).toArray();
                return docs;
            }
            catch (error) {
                console.log('Code 2: ', error);
                throw error;
            }
        });
    }
    function save(collectionName, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!db) {
                    yield reconnect();
                }
                let collection = db.collection(collectionName);
                const docs = yield collection.insertOne(item); // or at here?
                return Object.assign(Object.assign({}, item), { _id: docs === null || docs === void 0 ? void 0 : docs.insertedId });
            }
            catch (error) {
                console.log('Code 3: ', error);
                throw error;
            }
        });
    }
    function saveMany(collectionName, items) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!db) {
                    yield reconnect();
                }
                let collection = db.collection(collectionName);
                const docs = yield collection.insertMany(items);
                return { results: 'inserted' };
            }
            catch (error) {
                console.log('Code 3: ', error);
                throw error;
            }
        });
    }
    function update(collectionName_1, query_1, item_1) {
        return __awaiter(this, arguments, void 0, function* (collectionName, query, item, options = {}) {
            try {
                if (!db) {
                    yield reconnect();
                }
                let collection = db.collection(collectionName);
                const docs = yield collection.findOneAndUpdate(query, item, options);
                return docs;
            }
            catch (error) {
                console.log('Code 3: ', error);
                throw error;
            }
        });
    }
    function replace(collectionName_1, query_1, item_1) {
        return __awaiter(this, arguments, void 0, function* (collectionName, query, item, options = {}) {
            try {
                if (!db) {
                    yield reconnect();
                }
                let collection = db.collection(collectionName);
                const docs = yield collection.replaceOne(query, item, options);
                return docs;
            }
            catch (error) {
                console.log('Code 3: ', error);
                throw error;
            }
        });
    }
    function updateMany(collectionName_1, query_1, item_1) {
        return __awaiter(this, arguments, void 0, function* (collectionName, query, item, options = {}) {
            try {
                if (!db) {
                    yield reconnect();
                }
                let collection = db.collection(collectionName);
                const docs = yield collection.updateMany(query, /* { $set: { ...item } */ item, options);
                return docs;
            }
            catch (error) {
                console.log('Code 3: ', error);
                throw error;
            }
        });
    }
    function deleteOne(collectionName_1, query_1) {
        return __awaiter(this, arguments, void 0, function* (collectionName, query, options = {}) {
            try {
                if (!db) {
                    yield reconnect();
                }
                let collection = db.collection(collectionName);
                const docs = yield collection.deleteOne(query, options);
                return docs;
            }
            catch (error) {
                console.log('Code delete: ', error);
                throw error;
            }
        });
    }
    function deleteMany(collectionName_1, query_1) {
        return __awaiter(this, arguments, void 0, function* (collectionName, query, options = {}) {
            try {
                if (!db) {
                    yield reconnect();
                }
                let collection = db.collection(collectionName);
                const docs = yield collection.deleteMany(query, options);
                return docs;
            }
            catch (error) {
                console.log('Code delete many: ', error);
                throw error;
            }
        });
    }
    return {
        search,
        count,
        find,
        findOne,
        aggregate,
        save,
        saveMany,
        update,
        updateMany,
        replace,
        deleteOne,
        deleteMany,
    };
};
