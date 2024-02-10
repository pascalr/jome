const { describe, it } = require("minispec");
module.exports = () => {
  return { globals: { describe: describe, it: it } };
};
