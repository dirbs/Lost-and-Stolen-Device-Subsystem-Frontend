/*
Copyright (c) 2018-2019 Qualcomm Technologies, Inc.
All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the 
disclaimer below) provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer 
      in the documentation and/or other materials provided with the distribution.
    * Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote 
      products derived from this software without specific prior written permission.
    * The origin of this software must not be misrepresented; you must not claim that you wrote the original software. If you use 
      this software in a product, an acknowledgment is required by displaying the trademark/log as per the details provided 
      here: https://www.qualcomm.com/documents/dirbs-logo-and-brand-guidelines
    * Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
    * This notice may not be removed or altered from any source distribution.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED 
BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO 
EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { translate, I18n } from 'react-i18next';
import {Collapse, Row, Col, Button, Form, Label, FormGroup, Card, CardHeader, CardBody, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { withFormik, Field, FieldArray } from 'formik';
// Date Picker
import "react-dates/initialize";
import {errors, instance, getAuthHeader, getUserInfo, SweetAlert, languageCheck, fullNameCheck} from "../../../utilities/helpers";
import RenderModal from '../../../components/Form/RenderModal';
import renderError from '../../../components/Form/RenderError';
import doubleEntryInput from '../../../components/Form/DoubleEntryInput';
import update from 'immutability-helper';
import moment from "moment";
import { Prompt } from 'react-router'
import i18n from "./../../../i18n";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { RECOVERED_CASE } from './../../../utilities/constants'
const MySwal = withReactContent(Swal);

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
      msisdnsWithDeviceDetails: {},
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

  handleMSISDNdelete(index) {
      let all = this.props.values.msisdns.filter((value, i) => {
          return index !== i
      })

      this.props.setFieldValue('msisdns', all, false);
  }

  handleIMEIdelete(index) {
      let all = this.props.values.imeis.filter((value, i) => {
          return index !== i
      })
      this.props.setFieldValue('imeis', all, false);
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
    this.props.setFieldValue('msisdnInput', '000000000000', false)
    this.props.setFieldValue('retypeMsisdnInput', '000000000000', false)
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
      this.setState({ msisdnIndex: index, showModalTitle: `${i18n.t('title.updateMSISDN')}` }, () => {
        const oldValue = this.props.values.msisdns[index];
        if(oldValue) {
            this.props.setFieldValue('msisdnInput', oldValue, false)
            this.props.setFieldValue('retypeMsisdnInput', oldValue, false)
        }
      })
    } else {
      this.setState({ msisdnIndex: null, showModalTitle: `${i18n.t('title.addMSISDN')}` })
      this.props.setFieldValue('msisdnInput', '', false)
      this.props.setFieldValue('retypeMsisdnInput', '', false)
    }
    this.setState({ showModal: !this.state.showModal })
  }

  handleImeiModal(index) {
    if(index !== null) {
      this.setState({ imeiIndex: index, imeiModalTitle: `${i18n.t('title.updateIMEI')}` }, () => {
        const oldValue = this.props.values.imeis[index];
        if(oldValue) {
            this.props.setFieldValue('imeiInput', oldValue, false)
            this.props.setFieldValue('retypeImeiInput', oldValue, false)
        }
      })
    } else {
      this.setState({ imeiIndex: null, imeiModalTitle: `${i18n.t('title.addIMEI')}` })
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
          })
          .catch(error => {
              errors(this, error);
          })
      }
  }

  closeVerifyModal() {
    this.setState({ verifyModal: false, verifyModalMsisdnIndex: null });
  }

  closeVerifyImeiModal() {
    this.setState({ verifyImeiModal: false, verifyModalImeiIndex: null })
  }

  render() {
    const {
      values,
      errors,
      isSubmitting, 
      handleSubmit,
      dirty,
      caseSubmitted,
    } = this.props;
    return (
        <div>
            <Form onSubmit={handleSubmit}>
            <Row>
                {(values.imei_known === 'no' || values.imei_known === 'yes') &&
                <Col md={6} xs="12">
                    <Card>
                        <CardHeader className="wiri-btn">
                            <Button type="button" onClick={() => this.handleShowModal(null)} size="sm" color="outline-primary"
                                        disabled={values.msisdns.length >= 5}>{i18n.t('button.addNew')}</Button>
                            <div><b>{i18n.t('newCase.affectedMSISDNs')}</b></div>
                        </CardHeader>
                        <CardBody className="p0">
                            <div className="read-box">
                                <ul className="listing">
                                {values.msisdns.map((msisdn, i) => (
                                    <li key={i}>
                                        <div className="dflex">
                                            <div className="fitem">{msisdn}</div>
                                            <div className="fitem">
                                                <button className="btn btn-link p-0" onClick={(e) => {
                                                    e.preventDefault();
                                                    MySwal.fire({
                                                        title: i18n.t('alert.warning'),
                                                        text: i18n.t('confirmation.delItem'),
                                                        type: 'question',
                                                        showCancelButton: true,
                                                        confirmButtonText: i18n.t('button.delete'),
                                                        cancelButtonText: i18n.t('button.cancel')
                                                    }).then((result)=>{
                                                        if(result.value){
                                                            this.handleMSISDNdelete(i);
                                                        }
                                                    })
                                                }}><i className="fa fa-trash-o"></i></button>
                                                <Button type="button" onClick={() => this.handleShowModal(i)} color="link" className="p-0"><i
                                                    className="fa fa-pencil"></i></Button>{''}
                                                {(values.imei_known && this.props.authDetails.role === 'admin') && 
                                                    <Button type="button" onClick={() => this.updateTokenHOC(this.getIMEIsSeenWithMSISDN, i)} ref={'button' + i} size="xs" color="secondary">{i18n.t('button.fetchIMEIs')}</Button>
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
                <Col md={6} xs="12">
                    <Card>
                        <CardHeader className="wiri-btn">
                            <Button type="button" onClick={() => this.handleImeiModal(null)} size="sm" color="outline-primary" disabled={values.imeis.length >= 5}>{i18n.t('button.addNew')}</Button>
                            <div><b>{i18n.t('newCase.affectedIMEIs')}</b></div>
                        </CardHeader>
                        <CardBody className="p0">
                            <div className="read-box">
                                <ul className="listing">
                                {values.imeis.length > 0 && values.imeis.map((imei, i) =>
                                    <li key={i}>
                                        <div className="dflex">
                                            <div className="fitem">{imei}</div>
                                            <div className="fitem">
                                              <button className="btn btn-link p-0" onClick={(e) => {
                                                  e.preventDefault();
                                                  MySwal.fire({
                                                      title: i18n.t('alert.warning'),
                                                      text: i18n.t('confirmation.delItem'),
                                                      type: 'question',
                                                      showCancelButton: true,
                                                      confirmButtonText: i18n.t('button.delete'),
                                                      cancelButtonText: i18n.t('button.cancel')
                                                  }).then((result) => {
                                                      if (result.value) {
                                                          this.handleIMEIdelete(i);
                                                      }
                                                  })
                                              }}><i className="fa fa-trash-o"></i></button>
                                              <Button type="button" onClick={() => this.handleImeiModal(i)} color="link" className="p-0"><i className="fa fa-pencil"></i></Button>{''}
                                              <Button type="button" onClick={() => this.updateTokenHOC(this.getMSISDNsSeenWithIMEI, i)} ref={'button' + i} size="xs" color="secondary">{i18n.t('button.getDetails')}</Button>
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

            <RenderModal show={this.state.showModal}>
              <ModalHeader>{this.state.showModalTitle}</ModalHeader>
              <ModalBody>
                <FormGroup>
                  <Field name="msisdnInput" component={doubleEntryInput} label={i18n.t('input.typeMSISDN')} type="text" placeholder="" selectedKey={this.state.msisdnIndex} maxLength={15} />
                  <Field name="retypeMsisdnInput" component={doubleEntryInput} label={i18n.t('input.reTypeMSISDN')} type="text" placeholder="" selectedKey={this.state.msisdnIndex}  maxLength={15} />
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                  <Button color="primary" onClick={this.handleMsisdnSaving} disabled={((errors['msisdnInput'] || errors['retypeMsisdnInput']) || values['msisdnInput'].length === 0) ? true : false}>{i18n.t('button.save')}</Button>
                <Button color="secondary" onClick={this.closeShowModal}>{i18n.t('button.cancel')}</Button>
              </ModalFooter>
            </RenderModal>

            <RenderModal show={this.state.imeiModal}>
              <ModalHeader>{this.state.imeiModalTitle}</ModalHeader>
              <ModalBody>
                <FormGroup>
                  <Field name="imeiInput" component={doubleEntryInput} label={i18n.t('input.typeIMEI')} type="text" placeholder="" selectedKey={this.state.imeiIndex}  maxLength={16} />
                  <Field name="retypeImeiInput" component={doubleEntryInput} label={i18n.t('input.reTypeIMEI')} type="text" placeholder="" selectedKey={this.state.imeiIndex}  maxLength={16}/>
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                  <Button color="primary" onClick={this.handleImeiSaving} disabled={((errors['imeiInput'] || errors['retypeImeiInput']) || values['imeiInput'].length === 0) ? true : false}>{i18n.t('button.save')}</Button>
                <Button color="secondary" onClick={this.closeImeiModal}>{i18n.t('button.cancel')}</Button>
              </ModalFooter>
            </RenderModal>

            <RenderModal show={this.state.verifyModal} className="modal-lg">
              <ModalHeader>{i18n.t('verifyAssociatedIMEIsWithMSISDN')}: {values.msisdns[this.state.verifyModalMsisdnIndex]}</ModalHeader>
              <ModalBody>
                  <div className="table-responsive">
                      <table className="table table-striped table-bordered">
                          <thead>
                          <tr>
                              <th>{i18n.t('verify')}</th>
                              <th>{i18n.t('imeis')}</th>
                              <th align="right">{i18n.t('deviceDetails')}</th>
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
                                          if (e.target.checked){ 
                                            arrayHelpers.push(details.imei_norm);
                                            this.props.setFieldValue('imeiInput', details.imei_norm)
                                            this.props.setFieldValue('retypeImeiInput', details.imei_norm)
                                          }
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
                                          <Button color="primary" onClick={() => this.toggle(i)} style={{ marginBottom: '1rem' }}>{(this.state.imeisWithDeviceDetailsFlags[i] === false) ? `${i18n.t('showDeviceDetails')}`: `${i18n.t('hideDeviceDetails')}`}</Button>
                                          <Collapse isOpen={this.state.imeisWithDeviceDetailsFlags[i]}>
                                              <ul className="dd-list">
                                                  <li>{i18n.t('newCase.deviceBrand')}: <b>{(details.gsma) ? (details.gsma.brand ? details.gsma.brand: 'N/A'): 'N/A'}</b></li>
                                                  <li>{i18n.t('newCase.deviceModelName')}: <b>{(details.gsma) ? (details.gsma.model_name ? details.gsma.model_name: 'N/A'): 'N/A'}</b></li>
                                                  <li>{i18n.t('deviceModelNumber')}: <b>{(details.gsma) ? (details.gsma.model_number ? details.gsma.model_number: 'N/A'): 'N/A'}</b></li>
                                                  <li>{i18n.t('deviceType')}: <b>{(details.gsma) ? (details.gsma.device_type ? details.gsma.device_type: 'N/A'): 'N/A'}</b></li>
                                                  <li>{i18n.t('operatingSystem')}: <b>{(details.gsma) ? (details.gsma.operating_system ? details.gsma.operating_system: 'N/A') : 'N/A'}</b></li>
                                                  <li>{i18n.t('radioAccessTechnology')}: <b>{(details.gsma) ? (details.gsma.radio_access_technology ? details.gsma.radio_access_technology: 'N/A'): 'N/A'}</b></li>
                                                  <li>{i18n.t('lastSeenDate')}: <b>{moment(details.last_seen).format('MM-DD-YYYY')}</b></li>
                                              </ul>
                                          </Collapse>
                                      </td>
                                  </tr>
                                ))
                                  : <tr>
                                      <td colSpan="3">
                                          <span className="text-danger">{i18n.t('noRecordFound')}</span>
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
                <div className="text-danger">* {i18n.t('byCheckingCheckboxESYouAreAddingIMEIsToTheCase')}</div>}
                {/*<Button color="primary" onClick={this.handleVerifyModalSaving}>Add Selected IMEIs To Case</Button>*/}
                <Button color="secondary" type="button" onClick={this.closeVerifyModal}>{i18n.t('button.ok')}</Button>
              </ModalFooter>
            </RenderModal>

            <RenderModal show={this.state.verifyImeiModal} className="modal-lg">
              <ModalHeader>{this.props.authDetails.role === 'admin' ? i18n.t('verifyAssociatedMSISDNsWithIMEI') : "Verify associated information with IMEI"}: {values.imeis[this.state.verifyModalImeiIndex]}</ModalHeader>
              <ModalBody>
              {this.props.authDetails.role === 'admin' ?
              <>
                  <div className="table-responsive">
                      <table className="table table-striped table-bordered">
                          <thead>
                          <tr>
                              <th>{i18n.t('msisdn')}</th>
                              <th align="right">{i18n.t('deviceDetails')}</th>
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
                                          <Button color="primary" onClick={() => this.toggleMSISDNsDeviceDetails(i)} style={{ marginBottom: '1rem' }}>{(this.state.msisdnsWithDeviceDetailsFlags[i] === false) ? `${i18n.t('showDeviceDetails')}`: `${i18n.t('hideDeviceDetails')}`}</Button>
                                          <Collapse isOpen={this.state.msisdnsWithDeviceDetailsFlags[i]}>
                                              <ul className="dd-list">
                                                  <li>{i18n.t('newCase.deviceBrand')}: <b>{this.state.msisdnsWithDeviceDetails.gsma ? (this.state.msisdnsWithDeviceDetails.gsma.brand ? this.state.msisdnsWithDeviceDetails.gsma.brand : 'N/A') : 'N/A'}</b></li>
                                                  <li>{i18n.t('newCase.deviceModelName')}: <b>{this.state.msisdnsWithDeviceDetails.gsma ? (this.state.msisdnsWithDeviceDetails.gsma.model_name ? this.state.msisdnsWithDeviceDetails.gsma.model_name : 'N/A') : 'N/A'}</b></li>
                                                  <li>{i18n.t('deviceModelNumber')}: <b>{this.state.msisdnsWithDeviceDetails.gsma ? (this.state.msisdnsWithDeviceDetails.gsma.model_number ? this.state.msisdnsWithDeviceDetails.gsma.model_number: 'N/A'): 'N/A'}</b></li>
                                                  <li>{i18n.t('deviceType')}: <b>{this.state.msisdnsWithDeviceDetails.gsma ? (this.state.msisdnsWithDeviceDetails.gsma.device_type ? this.state.msisdnsWithDeviceDetails.gsma.device_type: 'N/A'): 'N/A'}</b></li>
                                                  <li>{i18n.t('operatingSystem')}: <b>{this.state.msisdnsWithDeviceDetails.gsma ? (this.state.msisdnsWithDeviceDetails.gsma.operating_system ? this.state.msisdnsWithDeviceDetails.gsma.operating_system : 'N/A') : 'N/A'}</b></li>
                                                  <li>{i18n.t('radioAccessTechnology')}: <b>{this.state.msisdnsWithDeviceDetails.gsma ? (this.state.msisdnsWithDeviceDetails.gsma.radio_access_technology ? this.state.msisdnsWithDeviceDetails.gsma.radio_access_technology: 'N/A'): 'N/A'}</b></li>
                                                  <li>{i18n.t('lastSeenDate')}: <b>{moment(details.last_seen).format('MM-DD-YYYY')}</b></li>
                                              </ul>
                                          </Collapse>
                                      </td>
                                  </tr>
                                ))
                                  :
                                  <tr>
                                      <td colSpan="3">
                                          <span className="text-danger">{i18n.t('noRecordFound')}</span>
                                      </td>
                                  </tr>
                              }
                              </tbody>
                            )}
                          />
                      </table>
                  </div>
              </> :
                <div className="table-responsive">
                  <h6>GSMA TAC information</h6>
                  {this.state.msisdnsWithDeviceDetails.gsma ?
                    <table className="table table-striped table-bordered">
                      <tbody>
                        <tr>
                          <th>Brand</th>
                          <th>Model Name</th>
                          <th>Model Number</th>
                          <th>Device Type</th>
                        </tr>
                        <tr>
                          <td>{this.state.msisdnsWithDeviceDetails.gsma.brand ? this.state.msisdnsWithDeviceDetails.gsma.brand: null}</td>
                          <td>{this.state.msisdnsWithDeviceDetails.gsma.model_name ? this.state.msisdnsWithDeviceDetails.gsma.model_name: null}</td>
                          <td>{this.state.msisdnsWithDeviceDetails.gsma.model_number ? this.state.msisdnsWithDeviceDetails.gsma.model_number : null}</td>
                          <td>{this.state.msisdnsWithDeviceDetails.gsma.device_type ? this.state.msisdnsWithDeviceDetails.gsma.device_type : null}</td>
                        </tr>
                      </tbody>
                    </table>
                    :
                    <center><h6>Information Not Found</h6></center>
                  }
                </div>
               }
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" type="button" onClick={this.closeVerifyImeiModal}>{i18n.t('button.close')}</Button>
              </ModalFooter>
            </RenderModal>
        <Row className="justify-content-end mb-1p5rem">
          <Col md="4" xl="3" xs="6">
            <Link className="btn btn-light btn-block"
                            to={'/search-cases'}>{i18n.t('button.cancel')}</Link>
            {/*<Button color="default" onClick={handleReset} disabled={!dirty || isSubmitting} block>*/}
              {/*Reset*/}
            {/*</Button>*/}
          </Col>
          <Col md="4" xl="3" xs="6">
            <Button color="primary" type="submit" block disabled={isSubmitting}>{i18n.t('button.recover')}</Button>
          </Col>
        </Row>
      </Form>
        </div>
    );
  }
}

const MyEnhancedForm = withFormik({
  mapPropsToValues: () => (
    { 
      "imei_known": "yes", 
      "msisdns": [], 
      "msisdnInput": "", 
      "retypeMsisdnInput": "", 
      "imeis": [], 
      "imeiInput": "", 
      "retypeImeiInput":"",  
    }
  ),
  
  // Custom sync validation
  validate: values => {
    let errors = {};
    // if (!values.imei_known) {
    //     errors.imei_known = `${i18n.t('forms.selectOption')}`
    // }
    // MSISDNs Modal Validation
    if (!values.msisdns || !values.msisdns.length) {
        errors.msisdns = `${i18n.t('forms.oneMSISDNmust')}`
    }
    if (!values.msisdnInput) {
      errors.msisdnInput = `${i18n.t('forms.fieldError')}`
    } else if (isNaN(Number(values.msisdnInput))) {
      errors.msisdnInput = `${i18n.t('forms.msisdnMustDigitCharacters')}`
    } else if (values.msisdnInput.length < 7 || values.msisdnInput.length > 15) {
      errors.msisdnInput = 'Retype MSISDN must consist of 7-15 digit characters only i.e."920123456789"'
    }

    if (!values.retypeMsisdnInput) {
      errors.retypeMsisdnInput = `${i18n.t('forms.fieldError')}`
    } else if (isNaN(Number(values.retypeMsisdnInput))) {
      errors.retypeMsisdnInput = `${i18n.t('forms.reTypemsisdnMustDigitCharacters')}`
    } else if (values.retypeMsisdnInput.length < 7 || values.retypeMsisdnInput.length > 15) {
      errors.retypeMsisdnInput = 'Retype MSISDN must consist of 7-15 digit characters only i.e."920123456789"'
    } else if (values.msisdnInput !== values.retypeMsisdnInput) {
      errors.retypeMsisdnInput = `${i18n.t('forms.msisdnNotMatch')}`
    }
    // IMEIs Modal Validation
    if (!values.imeis || !values.imeis.length) {
      errors.imeis = `${i18n.t('forms.oneIMEImust')}`
    }
    if (values.imei_known === 'yes') {
      if (!values.imeiInput) {
        errors.imeiInput = `${i18n.t('forms.fieldError')}`
      } else if (!/^(?=.[a-fA-F]*)(?=.[0-9]*)[a-fA-F0-9]{14,16}$/.test(values.imeiInput)) {
        errors.imeiInput = `${i18n.t('forms.imeiDigitCombination')}`
      }
      if (!values.retypeImeiInput) {
        errors.retypeImeiInput = `${i18n.t('forms.fieldError')}`
      } else if (!/^(?=.[a-fA-F]*)(?=.[0-9]*)[a-fA-F0-9]{14,16}$/.test(values.retypeImeiInput)) {
        errors.retypeImeiInput = `${i18n.t('forms.reTypeimeiDigitCombination')}`
      } else if (values.imeiInput !== values.retypeImeiInput) {
        errors.retypeImeiInput = `${i18n.t('forms.imeiNotMatch')}`
      }
    }
   
    return errors;
  },

  handleSubmit: (values, bag) => {
    bag.setSubmitting(false);
    bag.props.unBlockCall(null, bag.props.caseDetails.tracking_id, RECOVERED_CASE, prepareAPIRequest(values, bag.props.caseDetails) )
  },

  displayName: 'CaseForm', // helps with React DevTools
})(CaseForm);

function prepareAPIRequest(values, caseDetails) {
   // Validate Values before sending
    const params = {};
    params.incident_details = {};
    params.incident_details.incident_nature = caseDetails.incident_details.incident_nature;
    params.device_details = {};
    if(values.imeis) {
        params.device_details.imeis = values.imeis;
    }
    if(values.msisdns) {
        params.device_details.msisdns = values.msisdns;
    }
    return params;
}

class CaseUnblock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: false,
      caseSubmitted: false
    }
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

  render() {
    let kc = this.props.kc;
    let authDetails = this.props.userDetails;
    return (
        <I18n ns="translations">
        {
          (t, { i18n }) => (
            <div className="new-case-box animated fadeIn">
              <MyEnhancedForm isSubmitting="true" authDetails={authDetails} unBlockCall={this.props.handleCaseStatus} caseDetails={this.props.history.location.state} caseSubmitted={this.state.caseSubmitted} kc={kc}/>
            </div>
          )
        }
        </I18n>
    )
  }
}

export default translate('translations')(CaseUnblock);
