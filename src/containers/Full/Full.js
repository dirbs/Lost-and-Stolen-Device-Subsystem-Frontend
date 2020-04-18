import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import {Helmet} from 'react-helmet';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Footer from '../../components/Footer/';
import { I18n, translate } from 'react-i18next';
import { withFormik, Field } from 'formik';
import { Form, Button, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import RenderModal from '../../components/Form/RenderModal';
import renderInput from '../../components/Form/RenderInput';
import CaseStatus from '../../components/CaseStatus/CaseStatus';
import CheckStatus from '../../components/CaseStatus/CheckStatus';
import Dashboard from '../../views/Dashboard/';
import NewCase from '../../views/NewCase/';
import SearchCases from '../../views/SearchCases/';
import Pending from '../../views/Cases/Pending/';
import Blocked from '../../views/Cases/Blocked/';
import Recovered from '../../views/Cases/Recovered/';
import Block from '../../views/Cplc/Block/Block';
import Unblock from '../../views/Cplc/Unblock/Unblock';
import View from '../../views/Cases/View/';
import UpdateCase from '../../views/Cases/UpdateCase/';
import Page401 from '../../views/Errors/Page401';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {errors, getAuthHeader, instance, getUserInfo, languageCheck} from "../../utilities/helpers";
import {RECOVERED_CASE, BLOCKED_CASE} from "../../utilities/constants";
import i18n from './../../i18n';

/**
 * A Stateful component which provides Comment option in popup modal.
 */

class commentForm extends Component {
    constructor(props) {
        super(props);
        this.handleReset = this.handleReset.bind(this);
    }
    handleReset(values) {
        // Reset Field
        this.props.setFieldValue('comments', '', false);
        // Close Modal
        this.props.closeModal();
    }
    render() {
        const {
          isSubmitting,
          handleSubmit,
          showModal
        } = this.props;
        return (
            <RenderModal show={showModal}>
              <Form onSubmit={handleSubmit}>
                <ModalHeader>{i18n.t('comments.title')}</ModalHeader>
                <ModalBody>
                  <Field name="comments" component={renderInput} label={i18n.t('comments.label')} type="textarea" placeholder={i18n.t('comments.typeYourFindings')} requiredStar />
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" type="submit" disabled={isSubmitting}>{i18n.t('button.submit')}</Button>{' '}
                  <Button color="secondary" onClick={this.handleReset}>{i18n.t('button.cancel')}</Button>
                </ModalFooter>
              </Form>
            </RenderModal>
        )
    }
}

const MyEnhancedCommentForm = withFormik({
  mapPropsToValues: () => ({ "comments": ""}),

  // Custom sync validation
  validate: values => {
    let errors = {};

    if (!values.comments) {
      errors.comments = `${i18n.t('forms.fieldError')}`;
    } else if(values.comments.length > 1000) {
      errors.comments = `${i18n.t('forms.charactersWithinTh')}`;
    }else  if (values.comments && languageCheck(values.comments) === false){
        errors.comments = i18n.t('forms.langError')
    }
    return errors;
  },

  handleSubmit: (values, bag) => {
      bag.setSubmitting(false);
      bag.props.callServer(values);
  },

  displayName: 'commentForm', // helps with React DevTools
})(commentForm);

/**
 * A Stateful component which provides routing functionality for this SPA.
 * Also it's a parent component which adds feedback functionality for each case. i.e. Pending, Block and Recovered Cases.
 */
class Full extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      status: null,
      caseTrackingId: null,
        lang: 'en'
    }
    this.changeLanguage = this.changeLanguage.bind(this);
    this.handleCaseStatus = this.handleCaseStatus.bind(this);
    this.updateCaseStatus = this.updateCaseStatus.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
  }

    componentDidMount() {
        this.setState({
            lang: localStorage.getItem('i18nextLng')
        })
    }

  handleCaseStatus(e, id, status) {
    // Display modal box
    this.setState({ showModal: true })
    // Update Tracking ID and Status
    this.setState({ caseTrackingId: id, status: status})
  }

  updateTokenHOC(callingFunc, values = null) {
      let config = null;
      if(this.props.kc.isTokenExpired(0)) {
          this.props.kc.updateToken(0)
              .success(() => {
                  localStorage.setItem('token', this.props.kc.token)
                  config = {
                    headers: getAuthHeader(this.props.kc.token)
                  }
                  callingFunc(config, values);
              })
              .error(() => this.props.kc.logout());
      } else {
          config = {
            headers: getAuthHeader()
          }
          callingFunc(config, values);
      }
  }

  updateCaseStatus(config, values) {
    // get updated info for the case
    let {caseTrackingId, status} = this.state;
    const caseDetails = {
        "status_args": {
            "user_id": getUserInfo().sub,
            "case_comment": values.comments,
            "case_status": status,
            "username": getUserInfo().preferred_username,
            "role": this.props.userDetails.role
        }
    }
    // hide modal box and clear textarea input
    this.closeModal();
    // and submit to server
    instance.patch(`/case/${caseTrackingId}`, caseDetails, config)
        .then(response => {
            // Reset Comment to Empty Value
            values.comments = '';
            if(response.data.message) {
                //toast.success(response.data.message);
                if(status === BLOCKED_CASE) {
                    const statusDetails = {
                      id: response.data.tracking_id,
                      icon: 'fa fa-check',
                      status: 'Blocked',
                      action: 'Blocked'
                    }
                    this.props.history.push({
                      pathname: '/case-status',
                      state: { details: statusDetails }
                    });
                } else if(status === RECOVERED_CASE) {
                    const statusDetails = {
                      id: response.data.tracking_id,
                      icon: 'fa fa-check',
                      status: 'Recovered',
                      action: 'Recovered'
                    }
                    this.props.history.push({
                      pathname: '/case-status',
                      state: { details: statusDetails }
                    });
                }
            }
        })
        .catch(error => {
            errors(this, error);
        })
    }

    closeModal() {
      this.setState({ showModal: false, caseTrackingId: null, status: null })
    }

  changeLanguage(lng) {
    const { i18n } = this.props;
    i18n.changeLanguage(lng);
    //window.location.reload();
    this.setState({
        lang: lng
    });
  }
  render() {
    return (
      <I18n ns="translations">
        {
        (t, { i18n }) => (
          <div className="app">
              <Helmet>
                  <html lang={this.state.lang} />
                  <title>{i18n.t('title')}</title>
                  <body dir={this.state.lang==='ur'?'rtl':'ltr'} />
              </Helmet>
            <Header {...this.props} switchLanguage={this.changeLanguage} />
            <div className="app-body">
              <Sidebar {...this.props}/>
              <main className="main">
                <Breadcrumb {...this.props} />
                <MyEnhancedCommentForm callServer={(values) => this.updateTokenHOC(this.updateCaseStatus, values)} showModal={this.state.showModal} closeModal={this.closeModal} />
                <Container fluid>
                  <ToastContainer 
                  position="top-left" 
                  hideProgressBar />
                  <Switch>
                    <Route path="/dashboard" name="Dashboard"  render={(props) => <Dashboard handleCaseStatus={this.handleCaseStatus} {...this.props} {...props} /> } />
                    <Route path="/new-case" name="NewCase"  render={(props) => <NewCase {...this.props} {...props} /> } />
                    <Route path="/search-cases" name="SearchCases" render={(props) => <SearchCases handleCaseStatus={this.handleCaseStatus} {...this.props} {...props} /> } />
                    <Route path="/case-status" name="CaseStatus" component={CaseStatus}/>
                    <Route path="/check-status" name="CheckStatus" render={(props) => <CheckStatus {...props} /> } />
                    <Route path="/case/:tracking_id" render={(props) => <View handleCaseStatus={this.handleCaseStatus} {...this.props} {...props} /> } />
                    <Route path="/case-update/:tracking_id" name="UpdateCase" render={(props) => <UpdateCase {...this.props} {...props} /> } />
                    <Route path="/cases/pending" name="Pending" render={(props) => <Pending handleCaseStatus={this.handleCaseStatus} {...this.props} {...props} /> } />
                    <Route path="/cases/blocked" name="Blocked" render={(props) => <Blocked handleCaseStatus={this.handleCaseStatus} {...this.props} {...props} /> } />
                    <Route path="/cases/recovered" name="Recovered" render={(props) => <Recovered handleCaseStatus={this.handleCaseStatus} {...this.props} {...props} /> } />
                    <Route path="/cplc/block" name="Block" render={(props) => <Block handleCaseStatus={this.handleCaseStatus} {...this.props} {...props} /> } />
                    <Route path="/cplc/unblock" name="Unblock" render={(props) => <Unblock handleCaseStatus={this.handleCaseStatus} {...this.props} {...props} /> } />
                    <Route path="/unauthorized-access" name="Page401"  component={Page401} />
                    <Redirect from="/" to="/dashboard"/>
                  </Switch>
                </Container>
              </main>
            </div>
            <Footer />
          </div>
          )
        }
      </I18n>
    );
  }
}

export default translate('translations')(Full);
