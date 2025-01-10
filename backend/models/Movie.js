const mongoose = require('mongoose');
const { Schema } = mongoose;

const movieSchema = new Schema({
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
  watched: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default:1
  },
  poster:{
    type:String, 
    required: true,
  }
}, {
  timestamps: true  
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;