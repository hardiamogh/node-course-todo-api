const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');
const { ObjectID } = require('mongodb');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove
// Todo.findByIdAndRemove
Todo.findOneAndRemove({ _id: '5c5152320c7fcaabafe3832b' }).then((todo) => {
    console.log(todo);
})
// Todo.findByIdAndRemove('5c5151a80c7fcaabafe38307').then((todo) => {
//     console.log(todo);
// })