// load dependencies
const { workflow, task } = require('zenaton');

// define tasks
task("GetEnv", require("./tasks/GetEnv"));
task("FindHubspotContact", require("./tasks/FindHubspotContact"));

// define workflows
workflow("HubspotContactSync", require("./workflows/HubspotContactSync"));
