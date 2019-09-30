# codeceptjs-qtest-plugin
The qTest plugin for CodeceptJS


TEST CASE DECLARATION
 - For test case, need the tag with format as '@qTestTC#[testcaseId]' with tes case Id is the test design test case id

/****** Sample of config: ******/
Scenario('Login => Create New Account', (I) => {
  sideBarComponent.openTabAccounts();
}).tag('@component').tag('@qTestTC#12345678');
/****** ******/

CONFIGURATION
 - URL: 'https://abcCompany.qtestnet.com'
 - username: user to login qTest
 - password: password to login qTest
 - projectId: projectId (Ex: URL of qTest is https://abcCompany.qtestnet.com/p/12345, then projectId is 12345)
 - parentId: the id of test cycle or test suite
 - parentType: the type of parent 'test-cycle' or 'test-suite'
 - Passed: Passed Map value (go to qTestSite -> Config -> Automation Settings -> AUTOMATION INTEGRATION -> to see Mapping between Automationm status and qTest status)
 - Failed: Failed Map value (go to qTestSite -> Config -> Automation Settings -> AUTOMATION INTEGRATION -> to see Mapping between Automationm status and qTest status)

/****** Sample of config: ******/
exports.config = {
  ...
  plugins: {
    allure: {
      enabled: true,
      outputDir:"reports"
    },
    qtest: {
      enabled: true,
      require: 'codeceptjs-qtest-plugin',
      URL: 'https://abcCompany.qtestnet.com',
      username: 'user123@abc.net',
      password: '12345678',
      parentId: 4236645,
      parentType: 'test-suite',
      Passed: 'PASS',
      Failed: 'FAIL'
    }
  }
}
/****** ******/
