import test from 'ava';
import supertest from 'supertest';
import {
  Client,
  Website,
} from '../../../models';

/*
로그인
auth
회원가입
회원삭제
 */

function hasProperty(obj, prop) {
  return Object.hasOwnProperty.call(obj, prop);
}
function isSameId(id1, id2) {
  return String(id1) === String(id2);
}
export default function (app, url) {
  const NAME = 'Client';
  const INPUT = {
    email: 'testwebpush@gmail.com',
    password: 'abcdefghi',
    https: false,
    phone: '010464570842',
    domain: 'webpush.kr2',
  };
  let SAVED_INPUT = {};
  test.serial(`create ${NAME}`, async (t) => {
    const res = await supertest(app)
      .post(url)
      .send(INPUT);
    t.is(res.status, 200);
    const { body } = res;
    t.true(body.success);
    t.true(hasProperty(body, 'apiKey'));
    SAVED_INPUT.apiKey = body.apiKey;
  });
  test.serial(`login ${NAME}`, async (t) => {
    const res = await supertest(app)
      .post(`${url}/login`)
      .send({
        email: INPUT.email,
        password: INPUT.password,
      });
    t.is(res.status, 200);
    const { body } = res;
    t.true(body.success);
    t.true(hasProperty(body, 'apiKey'));
  });
  test.serial(`login Fail ${NAME}`, async (t) => {
    const res = await supertest(app)
      .post(`${url}/login`)
      .send({
        email: INPUT.email,
        password: 'failPassword',
      });
    t.is(res.status, 400);
  });
  test.serial(`get(auth) ${NAME}`, async (t) => {
    const { apiKey } = SAVED_INPUT;
    const res = await supertest(app)
      .get(url)
      .set('Authorization', `Bearer ${apiKey}`);
    t.is(res.status, 200);
    const { body } = res;
    t.true(body.success);
    t.true(hasProperty(body, 'client'));
    SAVED_INPUT = body.client;
  });
  test.serial(`get(auth) (failure) ${NAME}`, async (t) => {
    const res = await supertest(app)
      .get(url)
      .set('Authorization', 'Bearer testtest');
    t.is(res.status, 401);
  });
  test.serial(`changePassword ${NAME}`, async (t) => {
    const { apiKey } = SAVED_INPUT;
    const res = await supertest(app)
      .post(`${url}/changePassword`)
      .set('Authorization', `Bearer ${apiKey}`)
      .send({
        next: 'abababab',
      });
    t.is(res.status, 200);
    const { body } = res;
    t.true(body.success);
  });
  test.serial(`get password request ${NAME}`, async (t) => {
    const res = await supertest(app)
      .post(`${url}/password`)
      .send({
        email: INPUT.email,
      });
    t.is(res.status, 200);
  });
  test.serial(`get password request (failure) ${NAME}`, async (t) => {
    const res = await supertest(app)
      .post(`${url}/password`)
      .send({
        email: 'failure',
      });
    t.not(res.status, 200);
  });
  test.serial(`remove request ${NAME}`, async (t) => {
    const { apiKey } = SAVED_INPUT;
    const res = await supertest(app)
      .post(`${url}/remove`)
      .set('Authorization', `Bearer ${apiKey}`);
    t.is(res.status, 200);
  });
  test.serial(`cancel remove request ${NAME}`, async (t) => {
    const { apiKey } = SAVED_INPUT;
    const res = await supertest(app)
      .post(`${url}/remove/cancel`)
      .set('Authorization', `Bearer ${apiKey}`);
    t.is(res.status, 200);
  });
  test.serial(`delete ${NAME}`, async (t) => {
    const { apiKey } = SAVED_INPUT;
    const res = await supertest(app)
      .del(`${url}`)
      .set('Authorization', `Bearer ${apiKey}`);
    t.is(res.status, 200);
  });
  test.after.always.cb('delete all test data', (t) => {
    Client.deleteMany({
      email: {
        $in: [
          INPUT.email,
        ],
      },
    }, (error) => {
      if (error) {
        console.error(error);
        t.fail();
      } else {
        t.pass();
      }
      Website.deleteMany({
        client: {
          $in: [
            SAVED_INPUT.id,
          ],
        },
      }, (error) => {
        if (error) {
          console.error(error);
          t.fail();
        } else {
          t.pass();
          t.end();
        }
      });
    });
  });
}
