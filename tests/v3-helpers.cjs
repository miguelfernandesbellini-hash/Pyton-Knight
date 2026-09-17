const {setup}=require('./helpers.cjs');
function setupV3(extra={}) {const s=setup(extra);for(const name of ['activities-v3.js','systems/DiscoverySystem.js','systems/AnimationSystem.js','systems/MechanismSystem.js'])s.load(name);return s;}
module.exports={setupV3};
