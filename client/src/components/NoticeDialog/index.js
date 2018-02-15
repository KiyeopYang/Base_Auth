import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

const NoticeDialog = function NoticeDialog(
  {
    open, onClose, title, text, onConfirm
  }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText
          style={{
            color: 'black',
            whiteSpace: 'no-wrap',
          }}
        >
          { text }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {
          onConfirm ?
            <div>
              <Button onClick={() => { onConfirm(); onClose(); }} color="primary">
                확인
              </Button>
              <Button onClick={onClose} color="primary">
                취소
              </Button>
            </div>
            :
            <Button onClick={onClose} color="primary">
              확인
            </Button>
        }
      </DialogActions>
    </Dialog>
  );
};
export default NoticeDialog;
