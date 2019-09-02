const Book = require('./book');
const Person = require('./person');
const Booking = require('./booking');

Book.methods(['get', 'post', 'put', 'delete']);
Book.updateOptions({new: true, runValidators: true});
Book.route('count', (req, res, next) => {
    Book.count((error, value) => {
        if(error){
            res.status(500).json({errors: [error]});
        }else{
            res.json({value});
        }
    })
});

Person.methods(['get', 'post', 'put', 'delete']);
Person.updateOptions({new: true, runValidators: true});

Booking.methods(['get', 'post', 'put', 'delete']);
Booking.updateOptions({new: true, runValidators: true});

Booking.route('count', (req, res, next) => {
    Booking.count((error, value) => {
        if(error){
            res.status(500).json({errors: [error]});
        }else{
            res.json({value});
        }
    })
});

Booking.after('post', async function(req, res, next) {
    let bookId = res.locals.bundle.bookId;
    let personId = res.locals.bundle.personId;
    let dailyValue;
    let duration = res.locals.bundle.duration;

    await Book.findOne({ _id: bookId}, (err, result) => {
        if(result){
            dailyValue = result.value;
            result.using = true;
            result.amountUsed += 1;
            result.save(function(err){
                if(err)
                    console.log(err);
            });
        }
    });

    Booking.findOne({ _id: res.locals.bundle._id}, (err, result) => {
        if(result){
            result.value = dailyValue * duration;
            result.save(function(err){
                if(err)
                    console.log(err);
            });
        }
    });

    Person.findOne({ _id: personId}, function(err, result){
        if(result){
            result.isActive = true;
            result.save(function(err){
                if(err)
                    console.log(err);
            });
        }
    });

    next();
});

Booking.before('delete', function(req, res, next) {
    let bookingId = req.params.id;
    let bookBreakFlag = false;
    let personBreakFlag = false;
    let bookId;
    Booking.findOne({ _id: bookingId}, async (err, result) => {
        if(err){
            next();
        }

        if(result){
            bookId = result.bookId;
            personId = result.personId;

            /* Saving the use of book quantity */
            Book.findOne({ _id: bookId}, (err, result) => {
                if(result){
                    result.amountUsed -= 1;
                    result.save(function (err) {
                        if(err){
                            console.log('DB Error: Data correspondent to ID does not exists');
                        }else{
                            console.log('Book quantity usage state saved.');
                        }
                    });
                }
            });

            /* Searching if Book is in other Booking */

            await Booking.findOne({ bookId: result.bookId}, (err, result) => {
                if(err){
                    next();
                }

                if(result){
                    // Another Booking found, so Book will continue in use
                    bookBreakFlag = true;
                    next();
                }
            });

            if(!bookBreakFlag){
                // No other booking found, so Book will not be in use anymore
                Book.findOne({ _id: bookId }, (err, result) => {
                    if(err){
                        next();
                    }

                    if(result){
                        result.using = false;
                        result.save(function (err) {
                            if(err){
                                console.log('DB Error: Data correspondent to ID does not exists');
                            }else{
                                console.log('Book using state saved.');
                            }
                        });
                    }
                })
            }

            /* Searching if Person is in other Booking */
            
            await Booking.findOne({ bookId: result.personId}, (err, result) => {
                if(err){
                    next();
                }

                if(result){
                    // Another Booking found, so Person will continue active
                    personBreakFlag = true;
                    next();
                }
            });

            if(!personBreakFlag){
                // No other booking found, so Person will not be active anymore
                Person.findOne({ _id: personId }, (err, result) => {
                    if(err){
                        next();
                    }

                    if(result){
                        result.isActive = false;
                        result.save(function (err) {
                            if(err){
                                console.log('DB Error: Data correspondent to ID does not exists');
                            }else{
                                console.log('Person activity state saved.');
                            }
                        });
                    }
                })
            }
        }
    });
    next();
});

module.exports = {
    Book,
    Person,
    Booking
}