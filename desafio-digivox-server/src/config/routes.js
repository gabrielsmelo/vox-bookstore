const express = require('express');

module.exports = ((server) => {
    
    // API Routes
    const router = express.Router();
    server.use('/api', router);

    // Book Routes
    const bookstoreService = require('../api/voxbookstore/dataService');
    bookstoreService.Book.register(router, '/books');
    bookstoreService.Person.register(router, '/users');
    bookstoreService.Booking.register(router, '/booking');

});