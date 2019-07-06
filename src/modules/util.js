const request = require('request-promise-native');

/**
 * Request and return JSON.
 *
 * @param {object} opts - Standard request options.
 * @returns {object}
 */
const requestJson = async opts => request(opts).then(res => JSON.parse(res));

/**
 * Run a list of asynchronous functions that return promises.
 *
 * @param {function[]} tasks - Tasks to run.
 */
const runTasks = async (tasks) => {
  await Promise.all(tasks.splice(0, 1).map(p => p()));
  if (!tasks.length) {
    return;
  }

  await runTasks(tasks);
};

module.exports = {
  requestJson,
  runTasks,
};
