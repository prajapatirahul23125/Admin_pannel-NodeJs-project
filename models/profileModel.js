const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({

  name: {
    type: String,
    required: true,
  },

  specialty: {
    type: String,
    required: true,
  },
  skils: {
    type: String,
    
  },
  age: {
      type: String,
      required: true,
    },
//   gender: {
//     type: String,
//     required: true,
//   },
//   dob: {
//     type: String,
//     required: true,
//   },
//   contact: {
//     type: String,
//     required: true,
//   },
  email: {
    type: String,

  },
  imgpath: {
    type: String,

  },
  description: {
    type: String,

  },
//   country: {
//     type: String,
//     required: true,
//   },
//   city: {
//     type: String,
//     required: true,
//   },
  userId: {
    type: String,
  },
  imgpath: {
    type: String,
  }
  
});

const profileModel = mongoose.model("profileModel", profileSchema);

module.exports = profileModel;
