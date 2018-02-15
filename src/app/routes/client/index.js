import express from 'express';
import logging from '../../../lib/logging';
import {
  fromMongo,
} from '../../../lib/dbConnector';
import {
  Website,
  Client,
} from '../../../models';
import * as websiteLib from '../../lib/website';
import sendEmail from '../../lib/sendEmail';
import generateKey from '../../../lib/generateKey';
import auth from '../../auth';

const router = express.Router();
const NAME = '계정';

// 회원가입
router.post(
  '/',
  async (req, res) => {
    const PROCESS = '회원 가입';
    try {
      const {
        email,
        password,
        phone,
        https,
        domain,
      } = req.body;
      const clientFound = await Client.findOne({ email }).exec();
      const websiteFound = await Website.findOne({
        domain,
        https,
      }).exec();
      if (clientFound || websiteFound) {
        let message;
        if (clientFound) {
          message = `${NAME} ${PROCESS} 에러 : 이미 이메일이 존재합니다.`;
        } else {
          message = `${NAME} ${PROCESS} 에러 : 이미 도메인이 존재합니다.`;
        }
        res.status(500).json({ message });
      }
      let client = await new Client({
        email,
        password,
        phone,
      }).save();
      client = fromMongo(client.toObject());
      await websiteLib.make({
        client: client.id,
        domain,
        https,
      });
      res.json({
        apiKey: client.apiKey,
        success: true,
      });
    } catch (error) {
      logging.error(error);
      res.status(500).json({ message: `${NAME} ${PROCESS} 에러` });
    }
  },
);
// 로그인
router.post(
  '/login',
  async (req, res) => {
    const PROCESS = '로그인';
    const { email, password } = req.body;
    const client = await Client.findOne({
      email,
    }).exec();
    if (!client) {
      return res.status(400).json({
        message: `${NAME} ${PROCESS} 에러 : 입력된 계정이 없습니다.`,
      });
    }
    const valid = await client.passwordIsValid(password);
    if (!valid) {
      return res.status(400).json({
        message: `${NAME} ${PROCESS} 에러 : 비밀번호 입력이 잘못되었습니다.`,
      });
    }
    return res.json({
      apiKey: client.apiKey,
      success: true,
    });
  },
);
// 인증
router.get(
  '/',
  auth,
  async (req, res) => res.json({
    success: true,
    client: req.user,
  }),
);
// 삭제 요청
router.post(
  '/remove',
  auth,
  async (req, res) => {
    const PROCESS = '삭제';
    if (!req.user) {
      return res.status(400).json({
        message: `${NAME} ${PROCESS} 에러 : 계정이 없습니다.`,
      });
    }
    try {
      await Client.updateOne({
        _id: req.user.id,
      }, {
        $set: { requestForRemove: new Date() },
      });
      await sendEmail({
        to: req.user.email,
        title: '계정 삭제 요청 완료',
        html: '<div><p>14일 내에 삭제 요청을 취소하시려면 로그인 후, 계정 정보에서 취소하십시요.</p><hr /><a href=\'webpush.kr\'>webpush.kr</a></div>',
      });
      return res.json({
        success: true,
      });
    } catch (error) {
      logging.error(error);
      return res.status(400).json({
        message: `${NAME} ${PROCESS} 에러 : 삭제에 에러가 있습니다.`,
      });
    }
  },
);
// 삭제 요청 취소
router.post(
  '/remove/cancel',
  auth,
  async (req, res) => {
    const PROCESS = '삭제 취소';
    if (!req.user) {
      return res.status(400).json({
        message: `${NAME} ${PROCESS} 에러 : 계정이 없습니다.`,
      });
    }
    try {
      await Client.updateOne({
        _id: req.user.id,
      }, {
        $unset: { requestForRemove: '' },
      });
      return res.json({
        success: true,
      });
    } catch (error) {
      logging.error(error);
      return res.status(400).json({
        message: `${NAME} ${PROCESS} 에러 : 삭제에 에러가 있습니다.`,
      });
    }
  },
);
// 삭제 (실사용 아직)
router.delete(
  '/',
  auth,
  async (req, res) => {
    const PROCESS = '삭제';
    if (!req.user) {
      return res.status(400).json({
        message: `${NAME} ${PROCESS} 에러 : 계정이 없습니다.`,
      });
    }
    try {
      await Client.deleteOne({
        _id: req.user.id,
      });
      return res.json({
        success: true,
      });
    } catch (error) {
      logging.error(error);
      return res.status(400).json({
        message: `${NAME} ${PROCESS} 에러 : 삭제에 에러가 있습니다.`,
      });
    }
  },
);
router.post(
  '/changePassword',
  auth,
  async (req, res) => {
    const PROCESS = '정보 변경';
    const { next, token } = req.body;
    const { id } = req.user;
    const client = await Client.findOne({
      _id: id,
      passwordChangeToken: token,
    }).exec();
    if (!client) {
      return res.status(400).json({
        message: `${NAME} ${PROCESS} 에러 : 만료된 토큰입니다.`,
      });
    }
    try {
      await Client.updateOne(
        { _id: id },
        {
          $set: { password: next },
          $unset: { passwordChangeToken: '' },
        },
      );
      return res.json({
        success: true,
      });
    } catch (error) {
      logging.error(error);
      return res.status(400).json({
        message: `${NAME} ${PROCESS} 에러 : 비밀번호 변경에 에러가 있습니다.`,
      });
    }
  },
);
router.get(
  '/password/:token',
  async (req, res) => {
    const { token } = req.params;
    const client = await Client.findOne({ passwordChangeToken: token }).exec();
    if (client) {
      res.cookie('apiKey', client.apiKey);
      const secure = req.secure ? 'https://' : 'http://';
      const postfix = process.env.NODE_ENV === 'production' ? '' : ':3000';
      const redirectURL = `${secure}${req.hostname}${postfix}/account/${token}`;
      return res.redirect(redirectURL);
    }
    return res.status(400).json({ message: '연결된 계정이 없거나 토큰이 만료되었습니다.' });
  },
);
router.post(
  '/password',
  async (req, res) => {
    const { email } = req.body;
    const client = await Client.findOne({ email }).exec();
    if (client) {
      const key = generateKey();
      try {
        await Client.updateOne({
          _id: client._id,
        }, {
          $set: {
            passwordChangeToken: key,
          },
        });
        const secure = req.secure ? 'https://' : 'http://';
        const postfix = process.env.NODE_ENV === 'production' ? '' : ':8080';
        const link = `${secure}${req.hostname}${postfix}/api/client/password/${key}`;
        await sendEmail({
          to: email,
          title: '비밀번호 찾기 결과입니다.',
          html: `<div><p>링크를 클릭하여 비밀번호를 수정하십시요.</p><hr /><a href='${link}'>${link}</a></div>`,
        });
        return res.json({ success: true });
      } catch (error) {
        logging.error(error);
        return res.status(500).json({ message: '에러가 있습니다.' });
      }
    }
    return res.status(400).json({ message: '잘못된 이메일입니다.' });
  },
);
export default router;
