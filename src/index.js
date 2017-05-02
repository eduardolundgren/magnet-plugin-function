import {assertDefAndNotNull, assertString} from 'metal-assertions';
import {isFunction, isObject} from 'metal';

const isMultiple = module => {
  return isObject(module.route) && module.route.multiple;
};
const isPureFunction = value => {
  return isFunction(value) && (value.__proto__ === Function.__proto__);
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
        let result = await module.default.call(module.default, req, res, next);
        if (!res.headersSent) {
          res.type(type).send(result);
        }
      } catch (error) {
        next(error);
      }
    });
  },
};
