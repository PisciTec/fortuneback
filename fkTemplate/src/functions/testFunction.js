'use strict';

module.exports.testFunction = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'We are here in Fortune.',
      input: event,
    }),
  };


};
