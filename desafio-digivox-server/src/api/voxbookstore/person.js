const restful = require('node-restful');
const mongoose = restful.mongoose;

const personSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'name is required']},
    birth: { type: String, required: false},
    cep: { type: String, required: [true, 'cep is required']},
    isActive: { type: Boolean, required: false, default: false},
    created_at: { type: Date, default: Date.now}
});

module.exports = restful.model('Person', personSchema);