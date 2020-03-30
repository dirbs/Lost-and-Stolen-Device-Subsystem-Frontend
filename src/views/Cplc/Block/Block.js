import React, { Component } from 'react';
import { Row, Col, Form, Button } from 'reactstrap';
import { withFormik } from 'formik';
import i18n from "./../../../i18n";
import RenderFileInput from './../../../components/Form/RenderFileInput';
import { instance, getAuthHeader, errors, SweetAlert } from './../../../utilities/helpers';

class CaseCPLCForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setButtonDisabled: true
    }
  }
  render() {
    const {
      handleSubmit,
      setFieldValue,
      setFieldTouched
    } = this.props;
    return (
      <Form onSubmit={handleSubmit}>
        <RenderFileInput
          onChange={setFieldValue}
          onBlur={setFieldTouched}
          name="block_imeis_file"
          type="file"
          label="Upload CPLC file"
          inputClass="asitfield"
          inputClassError="asitfield is-invalid"
          requiredStar
        />
        <Button type="submit" color="primary">Submit</Button>
      </Form>
    );
  }
}

const MyEnhancedForm = withFormik({
  mapPropsToValues: () => ({ block_imeis_file: "", action: 'block' }),

  validate: values => {
    let errors = {};
    if (!values.block_imeis_file) {
      errors.block_imeis_file = 'please upload .csv file only.';
    }
    else if (values.block_imeis_file) {
      const validExts = [".csv"];
      let fileExt = values.block_imeis_file.name;
      fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
      if (validExts.indexOf(fileExt) < 0) {
        errors.block_imeis_file = "Invalid file selected, valid files are of " + validExts.toString() + " types.";
      }
    }
    else {
      this.setState({ setButtonDisabled: false });
    }
    return errors;
  },

  handleSubmit: (values, bag) => {
    bag.setSubmitting(false);
    bag.props.callServer(prepareAPIRequest(values));
  },

  displayName: 'CaseCPLCForm', // helps with React DevTools
})(CaseCPLCForm);

function prepareAPIRequest(values) {
  const formData = new FormData();
  formData.append('file', values.block_imeis_file);
  formData.append('action', values.action);
  return formData;
}

class Block extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      caseSubmitted: false
    }
  }

  updateTokenHOC = (callingFunc, values = null) => {
    let config = null;
    if (this.props.kc.isTokenExpired(0)) {
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

  saveCase = (config, values) => {
    instance.post('/cplc_block', values, config)
      .then(response => {
        if (response.data) {
          this.setState({ loading: false });
          const statusDetails = {
            id: response.data.task_id,
            icon: 'fa fa-check',
            status: `${i18n.t('Pending')}`,
            action: `${i18n.t('Blocked')}`
          }
          this.props.history.push({
            pathname: '/case-status',
            state: { details: statusDetails }
          });
        } else {
          SweetAlert({
            title: i18n.t('error'),
            message: i18n.t('somethingWentWrong'),
            type: 'error'
          })
        }
      })
      .catch(error => {
        errors(this, error);
      })
  }

  render() {
    console.log("allalal", this.props)
    return (
      <article>
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <div className="text-center">
              <p>Block IMEIs Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={6} lg={4} xl={3}>
            <MyEnhancedForm callServer={(values) => this.updateTokenHOC(this.saveCase, values)} />
          </Col>
        </Row>
      </article>
    );
  }
}

export default Block;