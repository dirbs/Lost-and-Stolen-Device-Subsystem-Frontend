/*
Copyright (c) 2018 Qualcomm Technologies, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the disclaimer below) provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { translate, I18n } from 'react-i18next';
import {Collapse, Row, Col, Button, Form, Label, FormGroup, Card, CardHeader, CardBody, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { withFormik, Field, FieldArray } from 'formik';
import 'react-select/dist/react-select.css';
// Date Picker
import "react-dates/initialize";
import RenderDatePicker from "../../components/Form/RenderDatePicker";
import "react-dates/lib/css/_datepicker.css";
import {errors, instance, getAuthHeader, getUserInfo} from "../../utilities/helpers";
import RenderModal from '../../components/Form/RenderModal'
import renderError from '../../components/Form/RenderError'
import doubleEntryInput from '../../components/Form/DoubleEntryInput'
import renderInput from '../../components/Form/RenderInput'
import update from 'immutability-helper';
import moment from "moment";
import { toast } from 'react-toastify';
import {Date_Format} from "../../utilities/constants";
import { Prompt } from 'react-router'

/**
 * This Stateful component registers a new case reported by effected user.
 * It gets all required details from User, such as Device Description, affected IMEIs and MSISDNs, Case Incidents and Personal Details.
 */
class CaseForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      msisdnIndex: null,
      showModalTitle: null,
      imeiIndex: null,
      imeiModal: false,
      imeiModalTitle: null,
      imeisWithDeviceDetails: [],
      msisdnsWithDeviceDetails: [],
      imeisWithDeviceDetailsFlags: [],
      msisdnsWithDeviceDetailsFlags: [],
      verifyModal: false,
      verifyImeiModal: false,
      collapse: false,
      verifyModalMsisdnIndex: null,
      verifyModalImeiIndex: null
    }
    this.toggle = this.toggle.bind(this);
    this.toggleMSISDNsDeviceDetails = this.toggleMSISDNsDeviceDetails.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleImeiModal = this.handleImeiModal.bind(this);
    this.closeShowModal = this.closeShowModal.bind(this);
    this.closeImeiModal = this.closeImeiModal.bind(this);
    this.onPasteHandler = this.onPasteHandler.bind(this);
    this.handleMsisdnSaving = this.handleMsisdnSaving.bind(this);
    this.handleImeiSaving = this.handleImeiSaving.bind(this);
    this.getIMEIsSeenWithMSISDN = this.getIMEIsSeenWithMSISDN.bind(this);
    this.getMSISDNsSeenWithIMEI = this.getMSISDNsSeenWithIMEI.bind(this);
    this.closeVerifyModal = this.closeVerifyModal.bind(this);
    this.closeVerifyImeiModal = this.closeVerifyImeiModal.bind(this);
    this.handleVerifyModalSaving = this.handleVerifyModalSaving.bind(this);
    this.handleMSISDNdelete = this.handleMSISDNdelete.bind(this);
    this.handleIMEIdelete = this.handleIMEIdelete.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
  }

  updateTokenHOC(callingFunc,index) {
      let config = null;
      if(this.props.kc.isTokenExpired(0)) {
          this.props.kc.updateToken(0)
              .success(() => {
                  localStorage.setItem('token', this.props.kc.token)
                  config = {
                    headers: getAuthHeader(this.props.kc.token)
                  }
                  callingFunc(config, index);
              })
              .error(() => this.props.kc.logout());
      } else {
          config = {
            headers: getAuthHeader()
          }
          callingFunc(config, index);
      }
  }

  handleMSISDNdelete(e, index) {
      e.preventDefault();
      if (window.confirm('Are you sure you wish to delete this item?')) {
          let all = this.props.values.msisdns.filter((value, i) => {
              return index !== i
          })

          this.props.setFieldValue('msisdns', all, false);
      }
  }

  handleIMEIdelete(e, index) {
      e.preventDefault();
      if (window.confirm('Are you sure you wish to delete this item?')) {
          let all = this.props.values.imeis.filter((value, i) => {
              return index !== i
          })
          this.props.setFieldValue('imeis', all, false);
      }
  }

  handleVerifyModalSaving() {
      this.closeVerifyModal();
  }

  toggle(index) {
    this.setState(update(this.state, {
      imeisWithDeviceDetailsFlags:  {
        [index]: {$set: (this.state.imeisWithDeviceDetailsFlags[index] === false ? true: false)}
      }
    }));
  }

  toggleMSISDNsDeviceDetails(index) {
    this.setState(update(this.state, {
      msisdnsWithDeviceDetailsFlags:  {
        [index]: {$set: (this.state.msisdnsWithDeviceDetailsFlags[index] === false ? true: false)}
      }
    }));
  }

  handleMsisdnSaving() {
    const index = this.state.msisdnIndex;
    if(index >= 0 && index !== null) {
      this.props.values.msisdns[index] = this.props.values.msisdnInput
    } else {
      this.props.values.msisdns.push(this.props.values.msisdnInput)
    }
    this.closeShowModal();
  }

  handleImeiSaving() {
    const index = this.state.imeiIndex;
    if(index >= 0 && index !== null) {
      this.props.values.imeis[index] = this.props.values.imeiInput
    } else {
      this.props.values.imeis.push(this.props.values.imeiInput)
    }
    this.closeImeiModal();
  }

  closeShowModal() {
    this.props.setFieldTouched('msisdnInput', false, false)
    this.props.setFieldTouched('retypeMsisdnInput', false, false)
    this.props.setFieldValue('msisdnInput', '00000000000', false)
    this.props.setFieldValue('retypeMsisdnInput', '00000000000', false)
    this.setState({ msisdnIndex: null, showModal: false })
  }

  closeImeiModal() {
    this.props.setFieldTouched('imeiInput', false, false)
    this.props.setFieldTouched('retypeImeiInput', false, false)
    this.props.setFieldValue('imeiInput', '00000000000000', false)
    this.props.setFieldValue('retypeImeiInput', '00000000000000', false)
    this.setState({ imeiIndex: null, imeiModal: false })
  }

  onPasteHandler(event) {
    event.preventDefault();
  }

  handleShowModal(index) {
    if(index !== null) {
      this.setState({ msisdnIndex: index, showModalTitle: 'Update an MSISDN' }, () => {
        const oldValue = this.props.values.msisdns[index];
        if(oldValue) {
            this.props.setFieldValue('msisdnInput', oldValue, false)
            this.props.setFieldValue('retypeMsisdnInput', oldValue, false)
        }
      })
    } else {
      this.setState({ msisdnIndex: null, showModalTitle: 'Add an MSISDN' })
      this.props.setFieldValue('msisdnInput', '', false)
      this.props.setFieldValue('retypeMsisdnInput', '', false)
    }
    this.setState({ showModal: !this.state.showModal })
  }

  handleImeiModal(index) {
    if(index !== null) {
      this.setState({ imeiIndex: index, imeiModalTitle: 'Update an IMEI' }, () => {
        const oldValue = this.props.values.imeis[index];
        if(oldValue) {
            this.props.setFieldValue('imeiInput', oldValue, false)
            this.props.setFieldValue('retypeImeiInput', oldValue, false)
        }
      })
    } else {
      this.setState({ imeiIndex: null, imeiModalTitle: 'Add an IMEI' })
      this.props.setFieldValue('imeiInput', '', false)
      this.props.setFieldValue('retypeImeiInput', '', false)
    }
    this.setState({ imeiModal: !this.state.imeiModal })
  }

  getIMEIsSeenWithMSISDN(config, index) {
      if(index !== null) {
        const oldValue = this.props.values.msisdns[index];
        instance.get(`/msisdn/${oldValue}`, config)
          .then(response => {
              this.setState({
                  imeisWithDeviceDetails: response.data.results,
              }, () => {
                 const flags = [];
                 for(let i=0; i < response.data.results.length; i++) {
                     flags[i] = false;
                 }
                 this.setState({ verifyModal: !this.state.verifyModal, imeisWithDeviceDetailsFlags: flags, verifyModalMsisdnIndex: index });
              });
              //const button = 'btn'+index;
              this.refs.btn0.setAttribute("disabled", "disabled");
          })
          .catch(error => {
              errors(this, error);
          })
      }
  }

  getMSISDNsSeenWithIMEI(config, index) {
      if(index !== null) {
        const oldValue = this.props.values.imeis[index];
        instance.get(`/imei/${oldValue}?seen_with=1`, config)
          .then(response => {
              this.setState({
                  msisdnsWithDeviceDetails: response.data,
                  verifyImeiModal: !this.state.verifyImeiModal,
                  verifyModalImeiIndex: index
              }, () => {
                 const flags = [];
                 if(response.data.subscribers.length > 0) {
                    for(let i=0; i < response.data.subscribers.length; i++) {
                        flags[i] = false;
                    }
                    this.setState({ msisdnsWithDeviceDetailsFlags: flags });
                 }
              });
              //const button = 'btn'+index;
              this.refs.btn0.setAttribute("disabled", "disabled");
          })
          .catch(error => {
              errors(this, error);
          })
      }
  }

  closeVerifyModal() {
    this.setState({ verifyModal: false, verifyModalMsisdnIndex: null })
  }

  closeVerifyImeiModal() {
    this.setState({ verifyImeiModal: false, verifyModalImeiIndex: null })
  }

  render() {
    const {
      values,
      errors,
      isSubmitting,
      handleChange,
      handleBlur,
      handleSubmit,
      setFieldValue,
      setFieldTouched,
      dirty,
      caseSubmitted
    } = this.props;
    return (
        <div>
            <Prompt
              when={dirty && !caseSubmitted}
              message={"You have unsaved changes, are you sure you want to leave?"}
            />
            <Form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <b>Device Description</b>
            </CardHeader>
            <CardBody>
              <Row>
                 <Col md="6" xs="12">
                     <Field name="brand" component={renderInput} label="Brand" type="text" placeholder="Brand" requiredStar />
                     <div className="txtarehei"></div>
                     <Field name="model_name" component={renderInput} label="Model Name" type="text" placeholder="Model Name" requiredStar />
                 </Col>
                 <Col md="6" xs="12">
                     <Field name="physical_description" component={renderInput} label="Physical Description" type="textarea" placeholder="Physical Description" requiredStar helpText="Please specify Device color or condition" />
                 </Col>
              </Row>
            </CardBody>
          </Card>
            {values.brand !== '' &&
            values.model_name !== '' &&
            values.physical_description !== '' &&
            <Row>
                <Col md={values.imei_known === 'yes' ? 12 : 6} xl={4} xs="12">
                    <Card>
                        <CardHeader className="min-hei52">
                            <b>IMEI Known</b>
                        </CardHeader>
                        <CardBody className="p0">
                          <div className="read-box radio-wrap">
                            <label className="mr-4 mb-0">
                                <input
                                    name="imei_known"
                                    type="radio"
                                    value="yes"
                                    checked={values.imei_known === 'yes'}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {' '} Yes
                            </label>
                            <label className="mb-0">
                                <input
                                    name="imei_known"
                                    type="radio"
                                    value="no"
                                    checked={values.imei_known === 'no'}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {' '} No
                            </label>
                            <Field name="imei_known" component={renderError}/>
                          </div>
                        </CardBody>
                    </Card>
                </Col>
                {(values.imei_known === 'no' || values.imei_known === 'yes') &&
                <Col md={6} xl={4} xs="12">
                    <Card>
                        <CardHeader>
                            <b>Affected MSISDN(s)</b>
                            <Button type="button" onClick={() => this.handleShowModal(null)} size="sm" color="outline-primary"
                                        className="float-right" disabled={values.msisdns.length >= 5}>Add New</Button>
                        </CardHeader>
                        <CardBody className="p0">
                            <div className="read-box">
                                <ul className="listing">
                                {values.msisdns.map((msisdn, i) => (
                                    <li key={i}>
                                        <div className="dflex">
                                            <div className="fitem">{msisdn}</div>
                                            <div className="fitem">
                                                <button className="btn btn-link p-0" onClick={(e) => this.handleMSISDNdelete(e, i)}><i
                                                    className="fa fa-trash-o"></i></button>
                                                <Button type="button" onClick={() => this.handleShowModal(i)} color="link" className="p-0"><i
                                                    className="fa fa-pencil"></i></Button>{''}
                                                {(values.imei_known === 'no' &&
                                                    <Button type="button" onClick={() => this.updateTokenHOC(this.getIMEIsSeenWithMSISDN, i)} ref={'button' + i} size="sm" color="secondary">Fetch IMEIs</Button>)
                                                }
                                            </div>
                                        </div>
                                    </li>
                                    )
                                )}
                                {values.msisdns.length === 0 && <Field name="msisdns" component={renderError}/>}
                                </ul>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                }
                {values.imei_known === 'yes' &&
                <Col md={6} xl={4} xs="12">
                    <Card>
                        <CardHeader>
                            <b>Affected IMEI(s)</b>
                            <Button type="button" onClick={() => this.handleImeiModal(null)} size="sm" color="outline-primary" className="float-right" disabled={values.imeis.length >= 5}>Add New</Button>
                        </CardHeader>
                        <CardBody className="p0">
                            <div className="read-box">
                                <ul className="listing">
                                {values.imeis.length > 0 && values.imeis.map((imei, i) =>
                                    <li key={i}>
                                        <div className="dflex">
                                            <div className="fitem">{imei}</div>
                                            <div className="fitem">
                                              <button className="btn btn-link p-0" onClick={(e) => this.handleIMEIdelete(e, i)}><i className="fa fa-trash-o"></i></button>
                                              <Button type="button" onClick={() => this.handleImeiModal(i)} color="link" className="p-0"><i className="fa fa-pencil"></i></Button>{''}
                                              <Button type="button" onClick={() => this.updateTokenHOC(this.getMSISDNsSeenWithIMEI, i)} ref={'button' + i} size="sm" color="secondary">Get Details</Button>
                                            </div>
                                        </div>
                                    </li>
                                )}
                                {values.imeis.length === 0 && <Field name="imeis" component={renderError}/>}
                                </ul>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                }
            </Row>
            }
            {(values.imei_known === 'no' || values.imei_known === 'yes') &&
            <Row>
                <Col xs="12">
                    <Card>
                        <CardHeader>
                            <b>Selected IMEIs</b>
                        </CardHeader>
                        <CardBody className="p0">
                          <div className="read-box">
                            <ul className="listing">
                              {(values.imeis.length > 0 && values.imeis.map((imei, i) => (
                                <li key={i}>
                                  <div className="dflex">
                                    <div className="fitem">{imei}</div>
                                    <div className="fitem">
                                        <button className="btn btn-link p-0"
                                                onClick={(e) => this.handleIMEIdelete(e, i)}><i
                                            className="fa fa-trash-o"></i></button>
                                    </div>
                                  </div>
                                </li>
                              )
                              ))}
                              {values.imeis.length === 0 && <Field name="imeis" component={renderError}/>}
                            </ul>
                          </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            }
            {values.imeis.length > 0 &&
          <div className="device-confirmed">
            <Row>
                <Col xl="6" xs="12">
                    <Card>
                        <CardHeader>
                            <b>Incident Details</b>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="6" xs="12">
                                    <FormGroup>
                                        <Label>Date of Incident <span className="text-danger">*</span></Label>
                                        <RenderDatePicker
                                            name="date_of_incident"
                                            value={values.date_of_incident}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            curDate={values.date_of_incident}
                                        />
                                        <Field name="date_of_incident" component={renderError} />
                                    </FormGroup>
                                </Col>
                                <Col md="6" xs="12">
                                    <FormGroup>
                                    <Label> Nature of Incident <span className="text-danger">*</span></Label>
                                    <div className="selectbox">
                                      <Field component="select" name="incident" className="form-control">
                                        <option value="">Select Nature of Incident</option>
                                        <option value="2">Lost</option>
                                        <option value="1">Stolen</option>
                                      </Field>
                                    </div>
                                    <Field name="incident" component={renderError} />
                                  </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col xl="6" xs="12">
                    <Card>
                        <CardHeader>
                            <b>Personal Details</b>
                        </CardHeader>
                        <CardBody className="p-2">
                            <Card body outline color="secondary" className="mb-2">
                                <Row>
                                    <Col md="12" xs="12">
                                        <Field name="full_name" component={renderInput} label="Full Name" type="text" placeholder="Full Name" requiredStar />
                                    </Col>
                                </Row>
                            </Card>
                            <Card body outline color="warning" className="mb-0">
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                            <Label>Date of Birth <span className="text-warning">*</span></Label>
                                            <RenderDatePicker
                                                name="dob"
                                                value={values.dob}
                                                onChange={setFieldValue}
                                                onBlur={setFieldTouched}
                                                curDate={values.dob}
                                            />
                                            <Field name="dob" component={renderError} />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" xs="12">
                                        <Field name="gin" component={renderInput} label="Govt. Identification No." type="text" placeholder="Govt. Identification Number" warningStar />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6" xs="12">
                                        <Field name="alternate_number" component={renderInput} label="Alternate Phone No." type="text" placeholder="Alternate Phone No." warningStar />
                                    </Col>
                                    <Col md="6" xs="12">
                                        <Field name="email" component={renderInput} label="E-mail Address" type="text" placeholder="E-mail Address" warningStar />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="12" xs="12">
                                        <Field name="address" component={renderInput} label="Address" type="text" placeholder="Address" warningStar />
                                    </Col>
                                </Row>
                                <Field name="oneOfFields" render={({
                                  field, // { name, value, onChange, onBlur }
                                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                  ...props
                                }) => (
                                    <div> {errors['oneOfFields'] && <span className="invalid-feedback text-warning" style={{display: 'block'}}>* {errors[field.name]}</span>} </div>
                                )} />
                            </Card>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
              }
        <Row>
            <RenderModal show={this.state.showModal}>
              <ModalHeader>{this.state.showModalTitle}</ModalHeader>
              <ModalBody>
                <FormGroup>
                  <Field name="msisdnInput" component={doubleEntryInput} label="Type MSISDN" type="text" placeholder="" selectedKey={this.state.msisdnIndex} maxLength={15} />
                  <Field name="retypeMsisdnInput" component={doubleEntryInput} label="Retype MSISDN" type="text" placeholder="" selectedKey={this.state.msisdnIndex}  maxLength={15} />
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                  <Button color="primary" onClick={this.handleMsisdnSaving} disabled={((errors['msisdnInput'] || errors['retypeMsisdnInput']) || values['msisdnInput'].length === 0) ? true : false}>Save</Button>
                <Button color="secondary" onClick={this.closeShowModal}>Cancel</Button>
              </ModalFooter>
            </RenderModal>

            <RenderModal show={this.state.imeiModal}>
              <ModalHeader>{this.state.imeiModalTitle}</ModalHeader>
              <ModalBody>
                <FormGroup>
                  <Field name="imeiInput" component={doubleEntryInput} label="Type IMEI" type="text" placeholder="" selectedKey={this.state.imeiIndex}  maxLength={16} />
                  <Field name="retypeImeiInput" component={doubleEntryInput} label="Retype IMEI" type="text" placeholder="" selectedKey={this.state.imeiIndex}  maxLength={16}/>
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                  <Button color="primary" onClick={this.handleImeiSaving} disabled={((errors['imeiInput'] || errors['retypeImeiInput']) || values['imeiInput'].length === 0) ? true : false}>Save</Button>
                <Button color="secondary" onClick={this.closeImeiModal}>Cancel</Button>
              </ModalFooter>
            </RenderModal>

            <RenderModal show={this.state.verifyModal} className="modal-lg">
              <ModalHeader>Verify Associated IMEIs with MSISDN: {values.msisdns[this.state.verifyModalMsisdnIndex]}</ModalHeader>
              <ModalBody>
                  <h6>Case Reporter Device Description</h6>
                  <div className="table-responsive">
                      <table className="table table-striped table-bordered">
                          <tbody>
                          <tr>
                              <th>Brand</th>
                              <th>Model name</th>
                              <th>Physical description</th>
                          </tr>
                          <tr>
                              <td>{values.brand}</td>
                              <td>{values.model_name}</td>
                              <td>{values.physical_description}</td>
                          </tr>
                          </tbody>
                      </table>
                  </div>
                  <div className="table-responsive">
                      <table className="table table-striped table-bordered">
                          <thead>
                          <tr>
                              <th>Verify</th>
                              <th>IMEIs</th>
                              <th align="right">Device Details</th>
                          </tr>
                          </thead>
                          <FieldArray
                            name="imeis"
                            render={arrayHelpers => (
                              <tbody>
                              {this.state.imeisWithDeviceDetails.length > 0 ?
                                this.state.imeisWithDeviceDetails.map((details, i) => (
                                  <tr key={i}>
                                      <td>
                                    <label>
                                      <input
                                        name="imeis"
                                        type="checkbox"
                                        value={details.imei_norm}
                                        checked={values.imeis.includes(details.imei_norm)}
                                        onChange={e => {
                                          if (e.target.checked) arrayHelpers.push(details.imei_norm);
                                          else {
                                            const idx = values.imeis.indexOf(details.imei_norm);
                                            arrayHelpers.remove(idx);
                                          }
                                        }}
                                      />{" "}
                                    </label>
                                      </td>
                                      <td>{details.imei_norm}</td>
                                      <td align="right">
                                          <Button color="primary" onClick={() => this.toggle(i)} style={{ marginBottom: '1rem' }}>{(this.state.imeisWithDeviceDetailsFlags[i] === false) ? 'Show Device Details': 'Hide Device Details'}</Button>
                                          <Collapse isOpen={this.state.imeisWithDeviceDetailsFlags[i]}>
                                              <ul className="dd-list">
                                                  <li>Brand: <b>{(details.gsma) ? (details.gsma.brand ? details.gsma.brand: 'N/A'): 'N/A'}</b></li>
                                                  <li>Model name: <b>{(details.gsma) ? (details.gsma.model_name ? details.gsma.model_name: 'N/A'): 'N/A'}</b></li>
                                                  <li>Model number: <b>{(details.gsma) ? (details.gsma.model_number ? details.gsma.model_number: 'N/A'): 'N/A'}</b></li>
                                                  <li>Device type: <b>{(details.gsma) ? (details.gsma.device_type ? details.gsma.device_type: 'N/A'): 'N/A'}</b></li>
                                                  <li>Operating system: <b>{(details.gsma) ? (details.gsma.operating_system ? details.gsma.operating_system: 'N/A') : 'N/A'}</b></li>
                                                  <li>Radio Access Technology: <b>{(details.gsma) ? (details.gsma.radio_access_technology ? details.gsma.radio_access_technology: 'N/A'): 'N/A'}</b></li>
                                                  <li>Last seen date: <b>{moment(details.last_seen).format('MM-DD-YYYY')}</b></li>
                                              </ul>
                                          </Collapse>
                                      </td>
                                  </tr>
                                ))
                                  : <tr>
                                      <td colSpan="3">
                                          <span className="text-danger">No record found</span>
                                      </td>
                                    </tr>
                              }
                              </tbody>
                            )}
                          />
                      </table>
                  </div>
              </ModalBody>
              <ModalFooter className={this.state.imeisWithDeviceDetails.length > 0 ? 'justify-content-between': ''}>
                  {this.state.imeisWithDeviceDetails.length > 0 &&
                <div className="text-danger">* By checking checkbox(es), you are adding IMEI(s) to the case</div>}
                {/*<Button color="primary" onClick={this.handleVerifyModalSaving}>Add Selected IMEIs To Case</Button>*/}
                <Button color="secondary" type="button" onClick={this.closeVerifyModal}>OK</Button>
              </ModalFooter>
            </RenderModal>

            <RenderModal show={this.state.verifyImeiModal} className="modal-lg">
              <ModalHeader>Verify Associated MSISDNs with IMEI: {values.imeis[this.state.verifyModalImeiIndex]}</ModalHeader>
              <ModalBody>
                  <h6>Case Reporter Device Description</h6>
                  <div className="table-responsive">
                      <table className="table table-striped table-bordered">
                          <tbody>
                          <tr>
                              <th>Brand</th>
                              <th>Model name</th>
                              <th>Physical description</th>
                          </tr>
                          <tr>
                              <td>{values.brand}</td>
                              <td>{values.model_name}</td>
                              <td>{values.physical_description}</td>
                          </tr>
                          </tbody>
                      </table>
                  </div>
                  <div className="table-responsive">
                      <table className="table table-striped table-bordered">
                          <thead>
                          <tr>
                              <th>MSISDN</th>
                              <th align="right">Device Details</th>
                          </tr>
                          </thead>
                          <FieldArray
                            name="imeis"
                            render={arrayHelpers => (
                              <tbody>
                              {this.state.msisdnsWithDeviceDetails.subscribers.length > 0 ?
                                this.state.msisdnsWithDeviceDetails.subscribers.map((details, i) => (
                                  <tr key={i}>
                                      <td>
                                         {details.msisdn}
                                      </td>
                                      <td align="right">
                                          <Button color="primary" onClick={() => this.toggleMSISDNsDeviceDetails(i)} style={{ marginBottom: '1rem' }}>{(this.state.msisdnsWithDeviceDetailsFlags[i] === false) ? 'Show Device Details': 'Hide Device Details'}</Button>
                                          <Collapse isOpen={this.state.msisdnsWithDeviceDetailsFlags[i]}>
                                              <ul className="dd-list">
                                                  <li>Brand: <b>{this.state.msisdnsWithDeviceDetails.gsma ? (this.state.msisdnsWithDeviceDetails.gsma.brand ? this.state.msisdnsWithDeviceDetails.gsma.brand : 'N/A') : 'N/A'}</b></li>
                                                  <li>Model name: <b>{this.state.msisdnsWithDeviceDetails.gsma ? (this.state.msisdnsWithDeviceDetails.gsma.model_name ? this.state.msisdnsWithDeviceDetails.gsma.model_name : 'N/A') : 'N/A'}</b></li>
                                                  <li>Model number: <b>{this.state.msisdnsWithDeviceDetails.gsma ? (this.state.msisdnsWithDeviceDetails.gsma.model_number ? this.state.msisdnsWithDeviceDetails.gsma.model_number: 'N/A'): 'N/A'}</b></li>
                                                  <li>Device type: <b>{this.state.msisdnsWithDeviceDetails.gsma ? (this.state.msisdnsWithDeviceDetails.gsma.device_type ? this.state.msisdnsWithDeviceDetails.gsma.device_type: 'N/A'): 'N/A'}</b></li>
                                                  <li>Operating system: <b>{this.state.msisdnsWithDeviceDetails.gsma ? (this.state.msisdnsWithDeviceDetails.gsma.operating_system ? this.state.msisdnsWithDeviceDetails.gsma.operating_system : 'N/A') : 'N/A'}</b></li>
                                                  <li>Radio Access Technology: <b>{this.state.msisdnsWithDeviceDetails.gsma ? (this.state.msisdnsWithDeviceDetails.gsma.radio_access_technology ? this.state.msisdnsWithDeviceDetails.gsma.radio_access_technology: 'N/A'): 'N/A'}</b></li>
                                                  <li>Last Seen Date: <b>{moment(details.last_seen).format('MM-DD-YYYY')}</b></li>
                                              </ul>
                                          </Collapse>
                                      </td>
                                  </tr>
                                ))
                                  :
                                  <tr>
                                      <td colSpan="3">
                                          <span className="text-danger">No record found</span>
                                      </td>
                                  </tr>
                              }
                              </tbody>
                            )}
                          />
                      </table>
                  </div>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" type="button" onClick={this.closeVerifyImeiModal}>Close</Button>
              </ModalFooter>
            </RenderModal>
          </Row>
        <Row className="justify-content-end mb-1p5rem">
          <Col md="4" xl="3" xs="6">
            <Link className="btn btn-light btn-block"
                            to={'/search-cases'}>Cancel</Link>
            {/*<Button color="default" onClick={handleReset} disabled={!dirty || isSubmitting} block>*/}
              {/*Reset*/}
            {/*</Button>*/}
          </Col>
          <Col md="4" xl="3" xs="6">
            <Button color="primary" type="submit" block  disabled={isSubmitting}>Submit</Button>
          </Col>
        </Row>
      </Form>
        </div>
    );
  }
}

const MyEnhancedForm = withFormik({
  mapPropsToValues: () => ({ "brand": "", "model_name": "", "physical_description": "", "imei_known": "", "imeis": [], "imeiInput": "", "retypeImeiInput":"", "msisdns": [], "msisdnInput": "", "retypeMsisdnInput": "",  "address": "", "gin": "", "full_name": "", "dob": "", "alternate_number": "", "email": "", "incident": "", "date_of_incident": "" }),

  // Custom sync validation
  validate: values => {
    let errors = {};
    if (!values.brand) {
        errors.brand = 'This field is Required'
    } else if(values.brand.length >= 1000) {
      errors.brand = 'Must be 1000 characters or less'
    }
    if (!values.model_name) {
        errors.model_name = 'This field is Required'
    } else if(values.model_name.length >= 1000) {
      errors.model_name = 'Must be 1000 characters or less'
    }
    if (!values.physical_description) {
        errors.physical_description = 'This field is Required'
    } else if(values.physical_description.length >= 1000) {
      errors.physical_description = 'Must be 1000 characters or less'
    }
    if (!values.imei_known) {
        errors.imei_known = 'Please select an option'
    }
    if (!values.msisdns || !values.msisdns.length) {
        errors.msisdns = 'At least one MSISDN must be entered'
    }
    if (!values.imeis || !values.imeis.length) {
        errors.imeis = 'At least one IMEI must be selected'
    }
    if (!values.msisdnInput) {
      errors.msisdnInput = 'This field is Required'
    } else if(isNaN(Number(values.msisdnInput))) {
      errors.msisdnInput = 'MSISDN must be digit characters'
    } else if(values.msisdnInput.length < 7 || values.msisdnInput.length > 15) {
      errors.msisdnInput = 'MSISDN must consist of 7 to 15 digit characters'
    }

    if (!values.retypeMsisdnInput) {
      errors.retypeMsisdnInput = 'This field is Required'
    } else if(isNaN(Number(values.retypeMsisdnInput))) {
      errors.retypeMsisdnInput = 'Retype MSISDN Must be digit characters'
    } else if(values.retypeMsisdnInput.length < 7 || values.retypeMsisdnInput.length > 15) {
      errors.retypeMsisdnInput = 'Retype MSISDN must consist of 7 to 15 digit characters'
    } else if(values.msisdnInput !== values.retypeMsisdnInput) {
      errors.retypeMsisdnInput = 'Entered MSISDN doesn\'t match'
    }
    // IMEIs Modal Validation
    if (!values.imeiInput) {
      errors.imeiInput = 'This field is Required'
    } else if(!/^(?=.[a-fA-F]*)(?=.[0-9]*)[a-fA-F0-9]{14,16}$/.test(values.imeiInput)){
      errors.imeiInput = 'IMEI must contains 14 to 16 characters and contains a combination of [0-9], [a-f] and [A-F]'
    }

    if (!values.retypeImeiInput) {
      errors.retypeImeiInput = 'This field is Required'
    } else if(!/^(?=.[a-fA-F]*)(?=.[0-9]*)[a-fA-F0-9]{14,16}$/.test(values.retypeImeiInput)){
      errors.retypeImeiInput = 'Retype IMEI must contains 14 to 16 characters and contains a combination of [0-9], [a-f] and [A-F]'
    } else if(values.imeiInput !== values.retypeImeiInput) {
      errors.retypeImeiInput = 'Entered IMEI doesn\'t match'
    }

    let today = moment().format(Date_Format);
    let paste =  moment('1900-01-01').format(Date_Format);

    if (!values.date_of_incident) {
        errors.date_of_incident = 'This field is Required'
    } else if (today < values.date_of_incident) {
      errors.date_of_incident = 'Date of Incident can\'t be in future';
    } else if (paste >= values.date_of_incident) {
      errors.date_of_incident = 'Date of Incident can\'t be that old';
    }

    if (!values.incident) {
        errors.incident = 'This field is Required'
    }
    if (!values.full_name) {
        errors.full_name= 'This field is Required'
    }
    if (!values.dob && !values.alternate_number && !values.address && !values.gin && !values.email) {
        errors.oneOfFields = 'One of the fields is required'
    }
    if (!values.dob) {

    } else if (today < values.dob) {
      errors.dob = 'Date of Birth can\'t be in future';
    } else if (paste >= values.dob) {
      errors.dob = 'Date of Birth can\'t be that old';
    }
    if (!values.email) {

    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
        values.email
      )
    ) {
      errors.email = 'Invalid email address';
    }
    return errors;
  },

  handleSubmit: (values, bag) => {
    bag.setSubmitting(false);
    if(values.msisdnInput || values.retypeMsisdnInput) {
      values.msisdnInput = values.retypeMsisdnInput = '00000000000000';
    }
    bag.props.callServer(prepareAPIRequest(values));
  },

  displayName: 'CaseForm', // helps with React DevTools
})(CaseForm);

function prepareAPIRequest(values) {
   // Validate Values before sending
    const searchParams = {};
    searchParams.loggedin_user = {};
    searchParams.loggedin_user.user_id = getUserInfo().sub;
    searchParams.loggedin_user.username = getUserInfo().preferred_username;
    searchParams.case_status = 1;
    searchParams.incident_details = {};
    searchParams.incident_details.incident_date = values.date_of_incident;
    searchParams.incident_details.incident_nature = values.incident;
    searchParams.personal_details = {};
    searchParams.personal_details.full_name = values.full_name;
    if(values.dob) {
        searchParams.personal_details.dob = values.dob;
    }
    if(values.address) {
        searchParams.personal_details.address = values.address;
    }
    if(values.gin) {
        searchParams.personal_details.gin = values.gin;
    }
    if(values.alternate_number) {
        searchParams.personal_details.number = values.alternate_number;
    }
    if(values.email) {
        searchParams.personal_details.email = values.email;
    }
    searchParams.device_details = {};
    if(values.brand) {
        searchParams.device_details.brand = values.brand;
    }
    if(values.model_name) {
        searchParams.device_details.model_name = values.model_name;
    }
    if(values.physical_description) {
        searchParams.device_details.description = values.physical_description;
    }
    if(values.imeis) {
        searchParams.device_details.imeis = values.imeis;
    }
    if(values.msisdns) {
        searchParams.device_details.msisdns = values.msisdns;
    }
    return searchParams;
}

class NewCase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: false,
      caseSubmitted: false
    }
    this.saveCase = this.saveCase.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
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

  saveCase(config, values) {
    instance.post('/case', values, config)
          .then(response => {
              if(response.data.message) {
                this.setState({ loading: false, caseSubmitted: true });
                const statusDetails = {
                  id: response.data.tracking_id,
                  icon: 'fa fa-check',
                  status: 'Pending',
                  action: 'Registered'
                }
                this.props.history.push({
                  pathname: '/case-status',
                  state: { details: statusDetails }
                });
              } else {
                toast.error('something went wrong');
              }
          })
          .catch(error => {
              errors(this, error);
          })
  }

  render() {
    let kc = this.props.kc;
    return (
        <I18n ns="translations">
        {
          (t, { i18n }) => (
            <div className="new-case-box animated fadeIn">
              <MyEnhancedForm callServer={(values) => this.updateTokenHOC(this.saveCase, values)} caseSubmitted={this.state.caseSubmitted} kc={kc}/>
            </div>
          )
        }
        </I18n>
    )
  }
}

export default translate('translations')(NewCase);
