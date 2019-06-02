const _ = require('lodash');

function checkRequired(data) {
  return field => {
    if (!data[field]) {
      return `${field} is required`;
    }
    return null;
  };
}

exports.validateRequiredFields = (data, fieldsToValidate) => {
  const checkFieldExists = checkRequired(data);
  return (
    _(fieldsToValidate)
      .map(checkFieldExists)
      // remove any null entries in the array
      .compact()
      // we're only returning the first error, even if there are multiple
      .value()[0]
  );
};
