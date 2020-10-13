import { Schema as _Schema, model } from 'mongoose';
var Schema = _Schema;

var schema = new Schema({ //schema of item displayed on fron page
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
});

export default model('Product', schema);//accessing a model