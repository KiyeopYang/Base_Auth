import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Route,
  withRouter,
  Switch,
} from 'react-router-dom';
import * as noticeDialogActions from './data/noticeDialog/actions';
import * as authActions from './data/auth/actions';
import loader from './data/loader/actions';
import NoticeDialog from './components/NoticeDialog';
import loaderDOM from './modules/loader';
import AuthRoute from './modules/AuthRoute';

class App extends React.Component {
  constructor(props) {
    super(props);
    loaderDOM(this.props.loaderState);
    this.props.authRequest()
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.loaderState !== nextProps.loaderState) {
      if (nextProps.auth.status === 'WAITING') {
        loaderDOM(true);
      } else {
        loaderDOM(nextProps.loaderState);
      }
    }
  }
  render() {
    const { noticeDialog, auth } = this.props;
    return (
      <React.Fragment>
        <NoticeDialog
          open={noticeDialog.open}
          onClose={this.props.noticeDialogOff}
          title={noticeDialog.title}
          text={noticeDialog.text}
          onConfirm={noticeDialog.onConfirm}
        />
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({
  state,
  noticeDialog: state.data.noticeDialog,
  loaderState: state.data.loader,
  auth: state.data.auth,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  noticeDialogOn: noticeDialogActions.on,
  noticeDialogOff: noticeDialogActions.off,
  loader,
  authRequest: authActions.request,
  logout: authActions.logout,
}, dispatch);
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(App));
