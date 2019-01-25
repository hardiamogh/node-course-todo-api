const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MpngoDB server');
    }
    console.log('Connected to MongoDB server');
    // db.collection('Todos').find({
    //     _id: new ObjectID('5c4abaf2f975b210d4d4f63b')
    // }).toArray().then((docs) => {
    //     console.log('Todos:');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch the todos', err)
    // });

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    //     console.log(JSON.stringify(count, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch the todos', err)
    // });

    db.collection('Users').find({ name: 'Amogh' }).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    })

    // db.close();
});