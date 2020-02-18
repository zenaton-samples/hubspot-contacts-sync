module.exports.handle = async function(name) {
  return process.env[name];
};
