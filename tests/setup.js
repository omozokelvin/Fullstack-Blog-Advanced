const { TextDecoder, TextEncoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

require('../models/User');

require('../db/connect');

jest.setTimeout(30000);
