const DB = require("./database-connection/db");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require('bcrypt-nodejs');

const UserSchema = DB.define(
    "users",
    {
        id:{
          autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }

},
{ timestamps: true },
{ tableName: "users" }

);


module.exports = UserSchema;