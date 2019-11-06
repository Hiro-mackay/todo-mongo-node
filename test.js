const mongoDb = require('./database');

const inserData1 = {
    name: 'Mackay',
    age: 21,
};
const inserData2 = {
    name: 'john',
    age: 18,
};
const inserData3 = {
    name: 'hiro',
    age: 30,
};

const findData = {
    name: 1
};

const updataData = {
    age: {
        $lt: 20
    }
};

const targetdata = {
    $set: {
        status: false
    }
}

const removeData = {
    status: false
};



(async function () {
    const myDb = new mongoDb('mongodb://localhost:27017', 'myDB');
    await myDb.connect();
    await myDb.initialDocuments('myCollection');
    await myDb.insertDocuments('myCollection', inserData1);
    await myDb.insertDocuments('myCollection', inserData2);
    await myDb.insertDocuments('myCollection', inserData3);
    await myDb.updataDocuments('myCollection', updataData, targetdata);
    await myDb.findDocuments('myCollection', findData);
    await myDb.removeDocuments('myCollection', removeData);
    await myDb.findDocuments('myCollection', findData);
    await myDb.disconnect();
})();