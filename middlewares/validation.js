const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { ObjectId } = require('mongoose').Types;

// validate a url link
const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

// validate email and password
const validateAuthentication = celebrate({
  body: Joi.object({
    email: Joi.string()
      .required()
      .email()
      .message('Valid email is required')
      .messages({
        'string.required': 'Email is required',
        'string.email': 'Valid email is required',
      }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
    }),
  }),
});

// validate name, about, and avatar image with validateURL, email, and password
const validateUserBody = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).messages({ 'string.min': 'Name must be longer then 2 letters', 'string.max': 'Name must be shorter then 30 letters' }),
    email: Joi.string().required().email().message('Valid email is required')
      .messages({
        'string.required': 'Email is required',
        'string.email': 'Valid email is required',
      }),
    password: Joi.string().min(8).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
    }),
  }),
});

// check if id is valid

const validateObjectId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message('Invalid id');
      }),
  }),
});

// validate name and link for article that have text and image via link
const validateArticle = celebrate({
  body: Joi.object({
    title: Joi.string().required().message('Title is invalid'),
    keyword: Joi.string().required().message('Keyword is invalid'),
    text: Joi.string().required().message('Text is invalid'),
    date: Joi.string().required().message('date is invalid'),
    source: Joi.string().required().message('Source is invalid'),
    image: Joi.string().custom(validateUrl).message('Invalid URL for article image link'),
    link: Joi.string().required().custom(validateUrl).messages({
      'string.empty': 'Link is required',
      'string.uri': 'Invalid URL for card link',
    }),
  }),
});

module.exports = {
  validateAuthentication,
  validateUserBody,
  validateObjectId,
  validateArticle,
};
