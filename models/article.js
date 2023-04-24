const mongoose = require('mongoose');

const reg = /[(http(s)?)://(www.)?a-zA-Z0-9@:%.+~#=]{2,256}.[a-z]{2,6}([-a-zA-Z0-9@:%+.~#?&//=]*)/i;

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        // use the regular expression from the user schema to validate the link
        return reg.test(v);
      },
      message: (props) => `${props.value} is not a valid link!`,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        // use the regular expression from the user schema to validate the link
        return reg.test(v);
      },
      message: (props) => `${props.value} is not a valid link!`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // reference the User model
    select: false,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    required: true,
    type: Date,
    default: Date.now,
  },
});

const article = mongoose.model('article', articleSchema);

module.exports = article;
