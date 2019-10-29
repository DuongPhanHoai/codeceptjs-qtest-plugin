const event = require('codeceptjs').event;
const {
  testruns
} = require('@davidkent/qtest-js-api');

function getqTestTCId (test) {
  if (test) {
    for (let i = 0; i < test.tags.length; i++)
      if (test.tags[i] && test.tags[i].startsWith('@qTestTC#'))
        return test.tags[i].substring(9);
  }
}
function getTestName (test) {
  if (test) {
    let fullTitle = test.title;
    if (test.tags && test.tags.length > 0)
      for (let i = 0; i < test.tags.length; i++)
        if (test.tags[i])
          fullTitle = fullTitle.replace(test.tags[i], '');
    fullTitle = fullTitle.trim();
    return fullTitle;
  }
}
function getTextSteps (test, config) {
  if (test) {
    let steps = [];
    
    for (let i = 0; i < test.steps.length; i++) {
      const curStep = test.steps[i];
      let description = curStep.name;
      for (let iArg = 0 ; iArg < curStep.args.length; iArg ++)
        description = `${description} ${curStep.args[iArg]}`;
      
      let status = config.Failed;
      if (curStep.status === 'success')
        status = config.Passed;
        
      steps[i] = {
        'description': description, 
        'order': i,
        expected_result: 'action successes',
        actual_result: curStep.status,
        'status': status};
    }
    return steps;
  }
}
function getTextSteps (test) {
  let textSteps = null;
  if (test) {
    for (let i = 0; i < test.steps.length; i++) {
      const curStep = test.steps[i];
      let description = curStep.name;
      for (let iArg = 0 ; iArg < curStep.args.length; iArg ++)
        description = `${description} ${curStep.args[iArg]}`;
      textSteps = textSteps?`${textSteps}\n${i} ${curStep.status} ${description}`:`${i} ${curStep.status} ${description}`;
    }
  }
  return textSteps;
}

const defaultConfig = {
  URL: "https://abcCompany.qtestnet.com",
  username: "user1@abc.net",
  password: "12345678",
  projectId: 123456,
  parentId: 12345,
  parentType: 'test-suite',
  Passed: 'PASS',
  Failed: 'FAIL'
};

module.exports = async function (config) {
  config = Object.assign(defaultConfig, config);

  // Login qtest
  const testrunsAPI = new testruns(config.URL, config.projectId);
  await testrunsAPI.login(config.username, config.password);


  // END TEST CASE
  event.dispatcher.on(event.test.failed, async (test) => {
    console.log('\n\n--- Writing result to qTest as failed --\n\n');
    const qtestTCId =  getqTestTCId(test);
    const qTestTestId = parseInt(qtestTCId);
    const testName = getTestName(test);
    const foundTestRun = await testrunsAPI.findAndCreateIfNotFound(qTestTestId, testName, config.parentId, config.parentType);
    if (foundTestRun && foundTestRun.id) {
      // Create test log
      testLog = await testrunsAPI.createAutoTestLog(foundTestRun.id, testName, config.Fßßailed, testName, getTextSteps(test, config));
    }
  });
  event.dispatcher.on(event.test.passed, async (test) => {
    console.log('\n\n--- Writing result to qTest as failed --\n\n');
    const qtestTCId =  getqTestTCId(test);
    const qTestTestId = parseInt(qtestTCId);
    const testName = getTestName(test);
    const foundTestRun = await testrunsAPI.findAndCreateIfNotFound(qTestTestId, testName, config.parentId, config.parentType);
    if (foundTestRun && foundTestRun.id) {
      // Create test log
      testLog = await testrunsAPI.createAutoTestLog(foundTestRun.id, testName, config.Passed, testName, getTextSteps(test, config));
    }
  });
}