const {
  JWT_SECRET = 'super_secret_key',

  MONGO_DB = 'mongodb://127.0.0.1:27017/newsexplorer',
  PORT = 3000,
} = process.env;

module.exports = {
  JWT_SECRET, MONGO_DB, PORT,
};
