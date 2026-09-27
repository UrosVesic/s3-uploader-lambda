const { format } = require("date-fns");

const formatDate = (date, formatString) => {
  return format(date, formatString);
};

module.exports = {
  formatDate,
};
