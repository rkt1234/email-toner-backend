// utils/bree.js
const Bree = require('bree');
const path = require('path');

const bree = new Bree({
  root: path.join(__dirname, '..', 'jobs'),
  defaultExtension: 'js',
  jobs: [], // Dynamically added
  doNotRequireJob: true
});

module.exports = bree;
