const {
  JWT_TOKEN = 'super_secret_key',
  MONGO_DB = 'mongodb://127.0.0.1:4879/newsexplorer',
  PORT = 3000,
} = process.env;

module.exports = {
  JWT_TOKEN, MONGO_DB, PORT,
};
