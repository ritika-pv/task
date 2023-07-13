const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({

  category: {
    id: { type: Number, required: [true, "Please enter category id"] },
    name: { type: String, required: [true, "Please enter category name"] }
  },
  name: { type: String, required: [true, "Please enter name"] },
  photoUrls: {type:String,default:"SampleUrl"},

  status: {
    type: String,
    enum: ['available', 'pending', 'sold'],
    default:'available',
  }
});



module.exports = mongoose.model('Pet', petSchema);



