import express from 'express';
import website from './website';
import webpush from './webpush';
import contact from './contact';
import result from './result';
import reserved from './reserved';
import group from './group';
import client from './client';

const router = express.Router();

router.use('/website', website);
router.use('/webpush', webpush);
router.use('/contact', contact);
router.use('/result', result);
router.use('/reserved', reserved);
router.use('/group', group);
router.use('/client', client);

export default router;
