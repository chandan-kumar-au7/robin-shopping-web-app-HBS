import { Schema as _Schema, model } from 'mongoose';
var Schema = _Schema;
import { hashSync, genSaltSync, compareSync } from 'bcrypt-nodejs';

var userSchema = new Schema({ // sign in database 
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
});

userSchema.methods.encryptPassword = function (password) { //encrypt the password means hide the password
    return hashSync(password, genSaltSync(5), null);
};

userSchema.methods.validPassword = function (password) {  //check id the password is valid
    return compareSync(password, this.password);
};

export default model('User', userSchema);