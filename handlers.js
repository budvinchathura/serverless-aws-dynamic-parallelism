'use strict';
const { v4: uuidv4 } = require('uuid');
const aws = require('aws-sdk');

module.exports.findTasks = function (event, context, callback) {
  const batchId = `batch-${uuidv4()}`
  const tasks = [];
  for (let i = 0; i < 5; i++) {
    const id = uuidv4();
    tasks.push(
      {
        taskId: id,
        taskName: `Task-${i + 1}-${id}`,
        values: Array(5).fill().map(() => Math.floor(Math.random() * 100)),
        batchId: batchId
      }
    );
  }
  callback(null, { body: { taskList: tasks, batchId: batchId } });
}

module.exports.processTask = async function (event, context, callback) {
  const s3 = new aws.S3();
  const result = {
    taskId: event.taskId,
    taskName: event.taskName,
    values: event.values,
    total: event.values.reduce((a, b) => a + b, 0),
  }
  await s3.putObject({
    Bucket: process.env.bucketName,
    Key: `${event.batchId}/${result.taskName}.json`,
    Body: JSON.stringify(result),
    ContentType: 'application/json'
  }).promise()
  callback(null, { taskId: result.taskId, total: result.total });
}


module.exports.summaryTask = async function (event, context, callback) {

  const summary = {
    batchId: event.body.batchId,
    finalTotal: event.results.map(task => task.total).reduce((a, b) => a + b, 0)
  }
  const s3 = new aws.S3();
  await s3.putObject({
    Bucket: process.env.bucketName,
    Key: `${event.body.batchId}/summary.json`,
    Body: JSON.stringify(summary),
    ContentType: 'application/json'
  }).promise()
  callback(null, { status: 'SUCCESS' });
}