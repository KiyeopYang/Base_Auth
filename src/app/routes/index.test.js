import test from 'ava';
import app from '../';
import website from './website/index-test';
import group from './group/index-test';
import client from './client/index-test';

test('api test', t => t.pass());
website(app, '/api/website');
group(app, '/api/group');
client(app, '/api/client');
