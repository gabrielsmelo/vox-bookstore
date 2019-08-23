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

Booking.after('post', function(req, res, next) {
    let tmp = res.locals.bundle.bookId;
    Book.findOne({ _id: tmp}, function(err, result){
        if(result){
            result.available = false;
            result.save(function(err){
                if(err)
                    console.log(err);
            });
        }
    });
    next();
});

Booking.after('delete', function(req, res, next) {
    let book = req.body.bookId;
    Book.findOne({ _id: book}, function(err, result){
        if(err)
            next();

        if(result){
            result.available = true;
            result.save(function (err) {
                if(err){
                    console.log('DB Error: Data correspondent to ID does not exists');
                }else{
                    console.log('Data saved.');
                }
            });
        }
    });
    next();
});

module.exports = {
    Book,
    Person,
    Booking
}