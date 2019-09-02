const restful = require('node-restful');
const mongoose = restful.mongoose;

const bookSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'name is required']},
    author: { type: String, required: [true, 'author is required']},
    publisher: { type: String, required: [true, 'publisher is required']},
    edition: { type: Number, min: 1, required: [true, 'edition is required']},
    quantity: { type: Number, min: 1, required: false, default: 1},
    amountUsed: { type: Number, required: false, default: 0 },
    using: { type: Boolean, required: false, default: false},
    value: {type: Number, required: true},
    created_at: { type: Date, default: Date.now}
});

module.exports = restful.model('Book', bookSchema);