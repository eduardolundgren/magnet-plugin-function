import {assertDefAndNotNull, assertString} from 'metal-assertions';
import {isFunction, isObject} from 'metal';

const isMultiple = module => {
  return isObject(module.route) && module.route.multiple;
};

const isPureFunction = value => {
  if (isFunction(value)) {
    // Infer as simple function when the function's "__proto__" is not modified.
    const maybeSimpleFunction = value.__proto__ === Function.__proto__;
    // Infer as async function if function definition starts with "async ".
    const maybeAsyncFunction = value.toString().indexOf('async ') === 0;
    return maybeSimpleFunction || maybeAsyncFunction;
  }
  return false;
};

export default {
  test(module, filename, magnet) {
    return (
      !isMultiple(module) &&
      isObject(module.route) &&
      isPureFunction(module.default)
    );
  },

  register(module, filename, magnet) {
    const path = module.route.path;
    const method = module.route.method || 'get';
    const type = module.route.type || 'html';
    const fileshort = filename.substring(
      magnet.getServerDistDirectory().length
    );

    assertString(
      method,
      `Route configuration method must be a string, ` + `check ${fileshort}.`
    );

    assertDefAndNotNull(
      path,
      `Route configuration path must be specified, ` + `check ${fileshort}.`
    );

    const app = magnet.getServer().getEngine();

    app[method.toLowerCase()](path, async (req, res, next) => {
      try {
        let result = await module.default.call(module.default, req, res, next, magnet);
        if (!res.headersSent) {
          res.type(type).send(result);
        }
      } catch (error) {
        next(error);
      }
    });
  },
};
