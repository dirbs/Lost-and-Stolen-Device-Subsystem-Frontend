import React, { Component } from 'react';
import { Row, Col, Form, Button, Table } from 'reactstrap';
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
      caseSubmitted: false,
      cplcStatus: null,
      checkStatus: null
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
          this.setState({ loading: false, cplcStatus: response.data });
          // this.props.history.push({
          //   pathname: '/case-status',
          //   state: { details: statusDetails }
          // });
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

  handleClick = (config, values) => {
    const checkStatusId = this.state.cplcStatus.task_id;
    instance.post(`/status/${checkStatusId}`, values, config)
    .then(response => {
      if (response.data) {
        this.setState({ checkStatus: response.data })
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

  handleDownloadFile = (config, values) => {
    const reportName = this.state.checkStatus.result.report_name;
    instance.post(`/download/${reportName}`, values, config)
    .then(response => {
      if (response.data) {
        let a = document.createElement("a");
        let file = new Blob([response.data], {type: 'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = 'cplc_failed_imeis';
        a.click();
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
    const { cplcStatus, checkStatus } = this.state;
    return (
      <article>
        <Row className="justify-content-center">
          <Col md={6} lg={4} xl={3}>
            <MyEnhancedForm callServer={(values) => this.updateTokenHOC(this.saveCase, values)} />
          </Col>
        </Row>
        {cplcStatus ?
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <div className="uploaded-submit-details">
                <h6>{cplcStatus.message}</h6>
                <p>Tracking ID is <b>{cplcStatus.task_id}</b> and status is <b>{cplcStatus.state}</b></p>
                <div className="link-box">
                  <Button color="primary" onClick={() => this.updateTokenHOC(this.handleClick)}>Check Status</Button>
                </div>
              </div>
            </Col>
          </Row>
          : null
        }
        {checkStatus ?
          <Row className="justify-content-center">
            <Col lg={10} xl={8}>
              <div className="check-status-details">
                <h6>Status is <span className="text-success">{checkStatus.state}</span></h6>
                {checkStatus.result.result && <p>{checkStatus.result.result}</p>}
                {checkStatus.result.failed ? 
                  <div>
                    <Table striped>
                      <thead>
                        <tr>
                          <th>Success</th>
                          <th>Failed</th>
                          <th>Failed IMEIs File</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{checkStatus.result.success}</td>
                          <td>{checkStatus.result.failed}</td>
                          <td>
                            <button onClick={() => this.updateTokenHOC(this.handleDownloadFile)}>{checkStatus.result.report_name}</button>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                : null
                }
              </div>
            </Col>
          </Row>
          : null
        }
      </article>
    );
  }
}

export default Block;