const mongoose = require('mongoose');
const { Schema, ObjectId } = mongoose;

module.exports = new Schema ({
    userId: ObjectId,
    productsId: Array(ObjectId),
    date: Date,
    isPayed: Boolean,
    meta: Object,
    deletedAt: Date,
    updatedAt: Date
});