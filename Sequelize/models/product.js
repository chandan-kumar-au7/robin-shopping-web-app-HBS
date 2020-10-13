const DB = require("./database-connection/db");
const { Sequelize, DataTypes } = require("sequelize");

const productSchema = DB.define(
    "product",
    {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        imagepath: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        price: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    },
    { timestamps: false },
    {tableName: "products"}
);


module.exports = productSchema;