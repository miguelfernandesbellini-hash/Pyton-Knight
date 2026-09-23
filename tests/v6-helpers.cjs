const {setupV4,localStorageFixture}=require('./v4-helpers.cjs');
function setupV6(extra={}) {
    const env=setupV4({location:{search:''},localStorage:localStorageFixture(),...extra});
    for(const file of ['activities-v6.js','systems/JourneySystem.js','systems/DevToolsSystem.js'])env.load(file);
    return env;
}
function fixtureV6(search='') {
    const env=require('./ui-fixture.cjs').fixture({v4:true});env.context.location.search=search;
    env.context.localStorage=localStorageFixture();
    for(const file of ['activities-v6.js','systems/JourneySystem.js','systems/DevToolsSystem.js'])env.load(file);
    return env;
}
module.exports={setupV6,fixtureV6,localStorageFixture};
