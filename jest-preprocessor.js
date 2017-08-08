const coffee = require('coffee-script');
const babelJest = require('babel-jest');

module.exports = {
  process: (src, path) => {
    // CoffeeScript files can be .coffee, .litcoffee, or .coffee.md
    if (coffee.helpers.isCoffee(path)) {
      return coffee.compile(src, { bare: true });
    }
    if (!/node_modules/.test(path)) {
      return babelJest.process(src, path);
    }
    return src;
  }
};
