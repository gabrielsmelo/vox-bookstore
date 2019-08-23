const restful = require('node-restful');
const mongoose = restful.mongoose;

const bookingSchema = new mongoose.Schema({
    personId: { type: String, required: [true, 'personId is required']},
    bookId: { type: String, required: [true, 'bookId is required']},
    bookName: { type: String, required: [true, 'bookName is required']},
    personName: { type: String, required: [true, 'personName is required']},
    retrieveDate: { type: String, required: false},
    delivery: { type: String, required: true},
    duration: { type: Number, required: true, default: 7, min: 1, max: 30}, // in days
    created_at: { type: Date, default: Date.now}
});

module.exports = restful.model('Booking', bookingSchema);