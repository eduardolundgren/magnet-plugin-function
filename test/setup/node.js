import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

process.env.NODE_ENV = 'test';

global.chai = chai;
global.sinon = sinon;
global.chai.use(sinonChai);

require('babel-core/register');
require('./setup')();
