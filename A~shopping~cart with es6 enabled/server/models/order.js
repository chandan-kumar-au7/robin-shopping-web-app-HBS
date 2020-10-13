import { Schema as _Schema, model } from 'mongoose';
var Schema = _Schema;

var schema = new Schema({//schema of oredered item
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    contactno1: {type: Number, required: true, min:10 },
    contactno2: {type: Number, required: true,  min:10 },
    city: {type: String, required: true, min:3},
    state: {type: String, required: true, min:3},
    pin: {type: Number, required: true , min: 6},
    paymentId: {type: String, required: true}
});

export default model('Order', schema);