const isDate = (value) => value !== null && !isNaN(new Date(value));

module.exports = { isDate };
