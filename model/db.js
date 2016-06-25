/**
 * @Author : Mahadi Hasan
 * @E-mail : mhm2k9@gmail.com
 */

var mongoose = require('mongoose'),
    connStr = 'mongodb://localhost:27017/leavethemarks';

mongoose.connect(connStr, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});