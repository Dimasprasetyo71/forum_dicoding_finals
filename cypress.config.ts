const { defineConfig } = require('cypress'); // eslint-disable-line

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) { // eslint-disable-line
      // implement node event listeners here

    },
  },
});
