// SauceDemo login credentials
const USERS = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  // "visual" user intentionally renders with CSS issues - great for
  // demonstrating how visual regression catches problems that
  // functional tests would miss
  visualGlitch: { username: 'visual_user', password: 'secret_sauce' },
};

module.exports = { USERS };
