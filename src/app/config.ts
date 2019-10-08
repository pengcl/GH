import {environment} from '../environments/environment';

export const Config = {
  'webHost': environment.webHost,
  'prefix': {
    'front': environment.webHost + '/front',
    'admin': environment.webHost + '/admin',
    'api': environment.webHost + '/api',
    'wApi': environment.webHost + '/wApi'
  }
};
