const sequelize = require("./database-connection/db");
const {
    Sequelize,
    Model
} = require("sequelize");
const User = require("../models/user");
const orderSchema = {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },
    cart: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    contactno1: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    contactno2: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false
    },
    pin: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    paymentId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
};

class Order extends Model {}
Order.init(orderSchema, {
    sequelize,
    tableName: "orders"
});
module.exports = Order;