const mongoose = require('mongoose');
const { Schema } = mongoose;

const DisplayMovieSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  releaseYear: {
    type: Number,
    required: true
  },
  genres: [{
    type: Schema.Types.ObjectId,
    ref: 'Genre', 
    required: true
  }],
  rating: {
    type: Number,
    min: 0,
    max: 10,
  },
  poster:{
    type:String, 
    required: true,
  }
}, {
  timestamps: true  
});

const DisplayMovie = mongoose.model('DisplayMovie', DisplayMovieSchema);

module.exports = DisplayMovie;