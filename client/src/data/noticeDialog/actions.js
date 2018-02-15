/* global fetch */
export const ON = 'data/noticeDialog/ON';
export const OFF = 'data/noticeDialog/OFF';

export const off = () => {
  return {
    type: OFF,
    open: false,
    title: '',
    text: '',
    onConfirm: null,
  };
};
export const on = (data) => {
  let title, message, text, onConfirm;
  if (!data) {
    message = '알 수 없는 에러';
  } else if (typeof data === 'string') {
    text = data;
  } else if (typeof data === 'object') {
    title = data.title;
    message = data.message;
    text = data.text;
    onConfirm = data.onConfirm;
  } else {
    message = '에러가 있습니다.';
  }
  return {
    type: ON,
    open: true,
    title: title || message ? '에러' : '알림',
    text: text || message || '내용',
    onConfirm,
  };
};
export const error = (e) => {
  const error = e.error || e;
  console.error(error);
  let text = '에러가 발생했습니다.';
  if (error.message && error.message !== '') {
    if (error.message === 'Failed to fetch') {
      text = '서버에 연결할 수 없습니다.';
    } else {
      text = error.message ? error.message : '알수없는에러';
    }
  } else {
    console.error(error);
    text = `에러가 있습니다. ${JSON.stringify(error)}`;
  }
  return {
    type: ON,
    open: true,
    title: 'ERROR',
    text,
  };
};
