import express from 'express';
import mongoose from 'mongoose';
import Multer from 'multer';
import path from 'path';
import validator from 'validator';
import Promise from 'bluebird';
import {
  getUrl,
  upload,
} from '../../lib/GCSFileManager';
import webpush from '../../lib/webpush';
import logging from '../../../lib/logging';

const router = express.Router();
const makeId = () => mongoose.Types.ObjectId();
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb
  },
});

const NAME = '웹 푸시';
// 없앨 것
router.post(
  '/example',
  multer.single('icon'),
  (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    const { file } = req;
    if (file) {
      // header is multipart(formdata)
      // need to be parsed to json
      const parsed = JSON.parse(req.body.dataForPush);
      upload({
        filename: `${makeId()}${path.extname(file.originalname)}`,
        dir: 'icons',
        content: file.buffer,
      })
        .then((url) => {
          parsed.push.icon = url;
          webpush(parsed)
            .then(() => res.json({ success: true }))
            .catch((error) => {
              logging.error(error);
              res.json({ success: false });
            });
        });
    } else {
      // header is json
      const data = req.body;
      data.icon = data.iconUrl;
      webpush(data)
        .then(() => res.json({ success: true }))
        .catch((error) => {
          logging.error(error);
          res.json({ success: false });
        });
    }
  },
);

router.post(
  '/testWithoutFile',
  (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    const { subscription, push } = req.body;
    push.icon = push.iconUrl;
    webpush({
      subscription,
      push,
    })
      .then(() => res.json({ success: true }))
      .catch((error) => {
        logging.error(error);
        res.json({ success: false });
      });
  },
);
router.post(
  '/testWithFile',
  multer.single('icon'),
  (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    const { file } = req;
    if (file) {
      // header is multipart(formdata)
      // need to be parsed to json
      let { subscription, push } = req.body;
      subscription = JSON.parse(subscription);
      push = JSON.parse(push);
      upload({
        filename: `${makeId()}${path.extname(file.originalname)}`,
        dir: 'icons',
        content: file.buffer,
      })
        .then((url) => {
          push.icon = url;
          webpush({
            subscription,
            push,
          })
            .then(() => res.json({ success: true }))
            .catch((error) => {
              logging.error(error);
              res.json({ success: false });
            });
        });
    } else {
      res.status(500).json({
        message: `${NAME} 전송 - 파일이 없습니다.`,
      });
    }
  },
);
const WELCOME = [];
// 읽기
router.post('/welcome/load', (req, res) => {
  const { websiteId } = req.body;
  if (validator.isMongoId(websiteId)) {
    const found = WELCOME.find(o => o.websiteId === websiteId);
    if (found) {
      res.json(found.dataForPush);
    } else {
      res.status(203).json(null);
    }
  } else {
    res.status(500).json({
      message: `${NAME} 조회 - 조회에 에러가 있습니다.`,
    });
  }
});
// 읽기
router.post(
  '/welcome/save',
  multer.single('icon'),
  (req, res) => {
    const { file } = req;
    const parsed = JSON.parse(req.body.data);
    const { websiteId, dataForPush } = parsed;
    if (validator.isMongoId(websiteId)) {
      new Promise((resolve, reject) => {
        if (file) {
          upload({
            filename: `${makeId()}${path.extname(file.originalname)}`,
            dir: 'icons',
            content: file.buffer,
          })
            .then((url) => {
              resolve(url);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          resolve(null);
        }
      })
        .then((url) => {
          if (url) {
            dataForPush.iconUrl = url;
          }
          const found = WELCOME.find(o => o.websiteId === websiteId);
          if (found) {
            found.dataForPush = dataForPush;
          } else {
            WELCOME.push({
              websiteId,
              dataForPush,
            });
          }
          res.json({ success: true });
        })
        .catch((error) => {
          logging.error(error);
          res.status(500).json({
            message: `${NAME} 저장 - 저장에 에러가 있습니다.`,
          });
        });
    } else {
      res.status(500).json({
        message: `${NAME} 저장 - 저장에 에러가 있습니다.`,
      });
    }
  },
);
// 리스트 불러오기
router.get('/welcome', (req, res) => {
  res.json(WELCOME);
});
// 한 건 삭제
router.post('/welcome/remove', (req, res) => {
  const {
    websiteId,
  } = req.body;
  if (validator.isMongoId(websiteId)) {
    const found = WELCOME.findIndex(o => o.websiteId === websiteId);
    if (found > -1) {
      WELCOME.splice(found, 1);
    }
    console.log(WELCOME);
    res.json({ success: true });
  } else {
    res.status(500).json({
      message: `${NAME} 삭제 - 삭제에 에러가 있습니다.`,
    });
  }
});

export default router;
