const express = require('express');
const multer = require('multer'); // multerモジュールを読み込む
const uuidv4 = require('uuid/v4'); // uuidモジュールを読み込む

const mongodb = require('./database'); //MongoDBモジュールを読み込む


const app = express(); // expressアプリを生成する
app.use(multer().none()); // multerでブラウザから送信されたデータを解釈する
app.use(express.static('web')); // webフォルダの中身を公開する

// TODOリストデータ
const todoList = [];

// MongoDBへの接続インスタンス
const db = new mongodb('mongodb://localhost:27017', 'TodoApp');
const collecionTodoApp = 'todo';




// http://localhost:3000/api/v1/list にアクセスしてきたときに
// TODOリストを返す
app.get('/api/v1/list', async (req, res) => {

    try {
        const todoList = await db.findDocuments(collecionTodoApp, {});

        console.log(`Found: ${todoList}`);
        // JSONを送信する
        res.json(todoList);
    } catch (e) {
        console.log(e);
    }



});

// http://localhost:3000/api/v1/add にデータを送信してきたときに
// TODOリストに項目を追加する
app.post('/api/v1/add', async (req, res) => {
    // クライアントからの送信データを取得する
    try {
        const todoData = req.body;
        const todoTitle = todoData.title;

        // ユニークIDを生成する
        const id = uuidv4();

        // TODO項目を作る
        const todoItem = {
            id,
            title: todoTitle,
            done: false
        };

        // TODOリストに項目を追加する
        todoList.push(todoItem);

        // Add databse
        await db.insertDocuments(collecionTodoApp, todoItem);


        // 追加した項目をクライアントに返す
        res.json(todoItem);
    } catch (e) {
        console.log(e);
    }
});

app.delete('/api/v1/item/:id', async (req, res) => {

    try {

        const index = todoList.findIndex((item) => item.id === req.params.id);


        if (index >= 0) {
            const deleted = todoList.splice(index, 1);
            await db.removeDocuments(collecionTodoApp, deleted[0]);
        }

        res.sendStatus(200);
    } catch (e) {
        console.log(e);
    }




});


app.put('/api/v1/item/:id', async (req, res) => {
    const index = todoList.findIndex((item) => item.id === req.params.id);


    if (index >= 0) {
        const item = todoList[index];

        if (req.body.done) {
            item.done = req.body.done === 'true';

            await db.connect();
            await db.updataDocuments(collecionTodoApp, {
                id: item.id
            }, {
                $set: {
                    done: item.done
                }
            });
            await db.disconnect();
        }
        console.log(`Item:${JSON.stringify(item)}`);
        res.sendStatus(200);
    }


})

app.listen(3000, async () => {
    console.log('Listening on port 3000')
    try {
        await db.initialDocuments(collecionTodoApp);
        await db.initConnect();
        console.log('mongodb connect successfully');
    } catch (e) {
        console.log(e)
    }

});