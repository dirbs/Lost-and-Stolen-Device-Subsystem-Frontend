/*
SPDX-License-Identifier: BSD-4-Clause-Clear
Copyright (c) 2018-2019 Qualcomm Technologies, Inc.
All rights reserved.
Redistribution and use in source and binary forms, with or without
modification, are permitted (subject to the limitations in the disclaimer
below) provided that the following conditions are met:

   - Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.
   - Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
   - All advertising materials mentioning features or use of this software,
   or any deployment of this software, or documentation accompanying any
   distribution of this software, must display the trademark/logo as per the
   details provided here:
   https://www.qualcomm.com/documents/dirbs-logo-and-brand-guidelines
   - Neither the name of Qualcomm Technologies, Inc. nor the names of its
   contributors may be used to endorse or promote products derived from this
   software without specific prior written permission.


SPDX-License-Identifier: ZLIB-ACKNOWLEDGEMENT
Copyright (c) 2018-2019 Qualcomm Technologies, Inc.
This software is provided 'as-is', without any express or implied warranty.
In no event will the authors be held liable for any damages arising from
the use of this software.
Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:

   - The origin of this software must not be misrepresented; you must not
   claim that you wrote the original software. If you use this software in a
   product, an acknowledgment is required by displaying the trademark/logo as
   per the details provided here:
   https://www.qualcomm.com/documents/dirbs-logo-and-brand-guidelines
   - Altered source versions must be plainly marked as such, and must not
   be misrepresented as being the original software.
   - This notice may not be removed or altered from any source distribution.

NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY
THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT
NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER
OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { translate, I18n } from 'react-i18next';
import {instance, errors, getAuthHeader, fullNameCheck} from './../../../utilities/helpers';
import {Row, Col, Button, Form, Label, FormGroup, Card, CardHeader, CardBody } from 'reactstrap';
import BoxLoader from '../../../components/BoxLoader/BoxLoader';
import { withFormik, Field } from 'formik';
import RenderDatePicker from "../../../components/Form/RenderDatePicker";
import renderInput from "../../../components/Form/RenderInput";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import {Date_Format} from "./../../../utilities/constants";
import renderError from "../../../components/Form/RenderError";
import {getUserInfo, languageCheck} from "../../../utilities/helpers";
import { Prompt } from 'react-router'
import switchToggleButton from "../../../components/Form/SwitchToggleButton";
import i18n from './../../../i18n';
import RenderSelect from '../../../components/Form/renderSelect';

/**
 * This Stateful component Provides an update functionality of Personal Details related with Case.
 */
class UpdateForm extends Component {
    render() {
    const {
      values,
      isSubmitting,
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
          message={i18n.t('unsavedChangesLeave')}
        />
        <Form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12 col-lg-8 mb-3">
              <h4>{i18n.t('pagetitle.updateCase')} - <small> {values.tracking_id} </small></h4>
              <p className="last-updated mb-0">{i18n.t('caseBox.creator')}: <b>{values.username}</b></p>
              <p className="last-updated">{i18n.t('caseBox.lastUpdated')}: <b>{values.updated_at}</b></p>
          </div>
          <div className="col-12 col-lg-4">
          </div>
        </div>
        <Row>
            <Col xs={12}>
                <Card>
                    <CardHeader>
                        <b>{i18n.t('newCase.deviceDescription')}</b>
                    </CardHeader>
                    <CardBody>
                        <table className="table table-bordered table-sm mb-0">
                            <tbody>
                                <tr>
                                    <th>{i18n.t('newCase.deviceBrand')}</th>
                                    <td>{values.brand}</td>
                                </tr>
                                <tr>
                                    <th>{i18n.t('newCase.deviceModelName')}</th>
                                    <td>{values.model_name}</td>
                                </tr>
                                <tr>
                                    <th>{i18n.t('newCase.devicePhysical')}</th>
                                    <td>{values.physical_description}</td>
                                </tr>
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            </Col>
          </Row>
        <Row>
            <Col xs="12" sm="6">
                <Card>
                    <CardHeader>
                        <b>{i18n.t('newCase.affectedMSISDNs')}</b>
                    </CardHeader>
                    <CardBody>
                        <table className="table table-bordered table-sm mb-0">
                            <tbody>
                            {values.msisdns.map((msisdn, index) => (
                               <tr key={index}>
                                    <td>{msisdn}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            </Col>
            <Col xs="12" sm="6">
                <Card>
                    <CardHeader>
                        <b>{i18n.t('newCase.affectedIMEIs')}</b>
                    </CardHeader>
                    <CardBody>
                        <table className="table table-bordered table-sm mb-0">
                            <tbody>
                            {values.imeis.map((imei, index) => (
                               <tr key={index}>
                                    <td>{imei}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            </Col>
          </Row>
        <Row>
              <Col xs="12" xl="6">
                  <Card>
                    <CardHeader>
                        <b>{i18n.t('newCase.incidentDetails')}</b>
                    </CardHeader>
                    <CardBody>
                        <table className="table table-bordered table-sm mb-0">
                            <tbody>
                                <tr>
                                    <th>{i18n.t('newCase.incidentDate')}</th>
                                    <td>{values.incident_date}</td>
                                </tr>
                               <tr>
                                    <th>{i18n.t('newCase.incidentNature')}</th>
                                    <td>{i18n.t(values.incident_nature)}</td>
                                </tr>
                               <tr>
                                    <th>Incident region</th>
                                    <td>{values.incident_region}</td>
                                </tr>
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <b>{i18n.t('newCase.blockStatus')}</b>
                  </CardHeader>
                  <CardBody>
                    <Field name="get_blocked" component={switchToggleButton} label={i18n.t('blockSwitch.label')} dataBefore={i18n.t('blockSwitch.dataBefore')} dataAfter={i18n.t('blockSwitch.dataAfter')} />
                  </CardBody>
                </Card>
              </Col>
              <Col xl="6" xs="12">
                    <Card>
                        <CardHeader>
                            <b>{i18n.t('newCase.personalDetails')}</b>
                        </CardHeader>
                        <CardBody className="p-2">
                            <Card body outline color="secondary" className="mb-2">
                                <Row>
                                    <Col md="12" xs="12">
                                        <Field name="full_name" component={renderInput} label={i18n.t('userProfile.fullName')} type="text" placeholder={i18n.t('userProfile.fullName')} requiredStar />
                                        <Field name="father_name" component={renderInput} label={i18n.t('userProfile.fatherName')} type="text" placeholder={i18n.t('userProfile.fatherName')} requiredStar />
                                        <Field name="mother_name" component={renderInput} label={i18n.t('userProfile.motherName')} type="text" placeholder={i18n.t('userProfile.motherName')} requiredStar />
                                    </Col>
                                </Row>
                            </Card>
                            <Card body outline color="warning" className="mb-0">
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                            <Label>{i18n.t('userProfile.dob')} <span className="text-warning">*</span></Label>
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
                                        <Field name="gin" component={renderInput} label={i18n.t('userProfile.gin')} type="text" placeholder={i18n.t('userProfile.ginum')} warningStar />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6" xs="12">
                                        <Field name="number" component={renderInput} label={i18n.t('userProfile.alternatePhoneNo')} type="text" placeholder={i18n.t('userProfile.alternatePhoneNo')} warningStar />
                                    </Col>

                                    <Col md="6" xs="12">
                                        <Field name="email" component={renderInput} label={i18n.t('userProfile.email')} type="text" placeholder={i18n.t('userProfile.email')} warningStar />
                                    </Col>
                                </Row>
                                <Row>
                                <Col md="6" xs="12">
                                        <Field name="landline_number" component={renderInput} label={i18n.t('userProfile.alternateLandline')} type="text" placeholder={i18n.t('userProfile.alternateLandline')} warningStar />
                                </Col>
                                <Col md="6" xs="6">
                                        <Field name="district" component={RenderSelect} label={i18n.t('userProfile.district')} type="text" value={{value: values.district, label:values.district}} warningStar />
                                </Col>
                                </Row>
                                <Row>
                                    <Col md="12" xs="12">
                                        <Field name="address" component={renderInput} label={i18n.t('userProfile.address')} type="text" placeholder={i18n.t('userProfile.address')} warningStar />
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
                <Col xs="12">
                  <Card>
                    <CardHeader>
                        <b>{i18n.t('comments.title')}</b>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col xs="12" xl="6">
                          <Field name="case_comment" component={renderInput} label={i18n.t('comments.updateReason')} type="textarea" placeholder={i18n.t('comments.typeReason')} requiredStar />
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
          </Row>
        <Row className="justify-content-end mb-1p5rem">
          <Col md={6} lg={3}>
            <Link className="btn btn-light btn-block"
                            to={'/search-cases'}>{i18n.t('newCase.cancelButton')}</Link>
            {/*<Button color="default" onClick={handleReset} disabled={!dirty || isSubmitting} block>*/}
              {/*Reset*/}
            {/*</Button>*/}
          </Col>
          <Col md={6} lg={3}>
            <Button color="primary" type="submit" block  disabled={isSubmitting}>{i18n.t('newCase.submitButton')}</Button>
          </Col>
        </Row>
      </Form>
      </div>
    );
  }
}

const MyEnhancedUpdateForm = withFormik({
    mapPropsToValues: props => {
    return {
      tracking_id: props.info.tracking_id || '',
      username: props.info.creator.username || '',
      updated_at: props.info.updated_at || '',
      brand: props.info.device_details.brand || '',
      model_name: props.info.device_details.model_name || '',
      physical_description: props.info.device_details.description || '',
      imeis: props.info.device_details.imeis || [],
      msisdns: props.info.device_details.msisdns || [],
      incident_date: props.info.incident_details.incident_date || '',
      incident_nature: props.info.incident_details.incident_nature || '',
      incident_region: props.info.incident_details.region || '',
      address: props.info.personal_details.address === 'N/A' ? '': props.info.personal_details.address || '',
      gin: props.info.personal_details.gin === 'N/A' ? '': props.info.personal_details.gin || '',
      full_name: props.info.personal_details.full_name === 'N/A' ? '' : props.info.personal_details.full_name || '',
      father_name: props.info.personal_details.father_name === 'N/A' ? '' : props.info.personal_details.father_name || '',
      mother_name: props.info.personal_details.mother_name === 'N/A' ? '' : props.info.personal_details.mother_name || '',
      dob: props.info.personal_details.dob === 'N/A' ? '' : props.info.personal_details.dob || '',
      number: props.info.personal_details.number === 'N/A' ? '' : props.info.personal_details.number || '',
      landline_number: props.info.personal_details.landline_number === 'N/A' ? '' : props.info.personal_details.landline_number || '',
      email: props.info.personal_details.email === 'N/A' ? '': props.info.personal_details.email || '',
      district: props.info.personal_details.district === 'N/A' ? '' : props.info.personal_details.district || '',
      get_blocked: props.info.get_blocked,
      case_comment: ''
    };
  },

  // Custom sync validation
  validate: values => {
    let errors = {};

    if (!values.full_name) {
        errors.full_name= `${i18n.t('forms.fieldError')}`
    }else if (languageCheck(values.full_name) === false){
        errors.full_name = i18n.t('forms.langError')
    }if(!values.father_name){
      errors.father_name= `${i18n.t('forms.fieldError')}`
    }else if(fullNameCheck(values.father_name)===false){
      errors.father_name = i18n.t('forms.fullNameError')
    }
    if(!values.mother_name){
      errors.mother_name = `${i18n.t('forms.fieldError')}`
    }else if(fullNameCheck(values.mother_name)===false){
      errors.mother_name = i18n.t('forms.fullNameError')
    }
    let today = moment().format(Date_Format);
    let paste =  moment('1900-01-01').format(Date_Format);
    if (!values.dob) {
      errors.dob = `${i18n.t('forms.fieldError')}`
    } else if (today < values.dob) {
      errors.dob = `${i18n.t('forms.dobErrorFuture')}`;
    } else if (paste >= values.dob) {
      errors.dob = `${i18n.t('forms.dobErrorOld')}`;
    }
    if (!values.email) {
      errors.email = `${i18n.t('forms.fieldError')}`
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
        values.email
      )
    ) {
      errors.email = `${i18n.t('forms.emailInvalid')}`;
    }
    if(!values.gin){
      errors.gin = `${i18n.t('forms.fieldError')}`
    }else if(!/^[0-9]+$/.test(values.gin)){
      errors.gin = i18n.t('forms.notNumberError')
    }else if(values.gin.length<13){
      errors.gin = i18n.t('forms.ginLength')
    }
    if(!values.landline_number){
      errors.landline_number = `${i18n.t('forms.fieldError')}`
    }else if(!/^[0-9]+$/.test(values.landline_number)){
      errors.landline_number = i18n.t('forms.notNumberError')
    }else if(values.landline_number.length<7 || values.landline_number.length>15){
      errors.landline_number = i18n.t('form.alternateNumbers')
    }
    if(!values.number){
      errors.number = `${i18n.t('forms.fieldError')}`
    }else if(!/^[0-9]+$/.test(values.number)){
      errors.number = i18n.t('forms.notNumberError')
    }else if(values.number.length<7 || values.number.length>15){
      errors.number = i18n.t('form.alternateNumbers')
    }
    if(!values.district){
      errors.district = `${i18n.t('forms.fieldError')}`
    }if(!values.address){
      errors.address = i18n.t('forms.fieldError')
    }
    if (!values.case_comment) {
        errors.case_comment= `${i18n.t('forms.fieldError')}`
    } else if(values.case_comment.length > 1000) {
      errors.case_comment = `${i18n.t('forms.charactersWithinTh')}`
    }else if (languageCheck(values.case_comment) === false){
        errors.case_comment = i18n.t('forms.langError')
    }
    return errors;
  },

  handleSubmit: (values, bag) => {
    bag.setSubmitting(false);
    bag.props.callServer(prepareAPIRequest(values, bag.props.authDetails));
  },

  displayName: 'UpdateForm', // helps with React DevTools
})(UpdateForm);

function prepareAPIRequest(values, authDetails) {
    // Validate Values before sending
    const searchParams = {};
    searchParams.status_args = {};
    searchParams.status_args.user_id = getUserInfo().sub;
    searchParams.status_args.username = getUserInfo().preferred_username;
    searchParams.status_args.role = authDetails.role;
    if(values.case_comment) {
        searchParams.status_args.case_comment = values.case_comment;
    }
    searchParams.personal_details = {};
    searchParams.personal_details.full_name = values.full_name;
    searchParams.personal_details.father_name = values.father_name;
    searchParams.personal_details.mother_name = values.mother_name;
    if(values.dob) {
        searchParams.personal_details.dob = values.dob;
    }
    if(values.district){
      searchParams.personal_details.district = values.district
    }
    if(values.address) {
        searchParams.personal_details.address = values.address;
    }
    if(values.gin) {
        searchParams.personal_details.gin = values.gin;
    }
    if(values.landline_number) {
      searchParams.personal_details.landline_number = values.landline_number;
  }
    if(values.number) {
        searchParams.personal_details.number = values.number;
    }
    if(values.email) {
        searchParams.personal_details.email = values.email;
    }
    searchParams.case_details = {};
    if(values.get_blocked) {
        searchParams.case_details.get_blocked = values.get_blocked;
    }
    if(!values.get_blocked) {
        searchParams.case_details.get_blocked = false;
    }
    return searchParams;
}

class UpdateCase extends Component {
  constructor(props) {
    super(props);

    this.getCaseFromServer = this.getCaseFromServer.bind(this);
    this.updateCase = this.updateCase.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);

    this.state = {
        data: null,
        loading: true,
        caseTrackingId: null,
        caseSubmitted: false
    }
  }
  componentDidMount() {
      this.updateTokenHOC(this.getCaseFromServer);
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

  getCaseFromServer(config) {
      const {tracking_id} = this.props.match.params;
      instance.get(`/case/${tracking_id}`, config)
          .then(response => {
              this.setState({ data: response.data, loading: false, caseTrackingId: response.data.tracking_id});
          })
          .catch(error => {
              errors(this, error);
          })
  }

  updateCase(config, values) {
      const { caseTrackingId } =  this.state;
      instance.put(`/case/${caseTrackingId}`, values, config)
        .then(response => {
            if(response.data.message) {
                this.setState({ caseSubmitted: true });
                //toast.success(response.data.message);
                const statusDetails = {
                  id: response.data.tracking_id,
                  icon: 'fa fa-check',
                  status: `${i18n.t('Pending')}`,
                  action: `${i18n.t('Updated')}`
                }
                this.props.history.push({
                  pathname: '/case-status',
                  state: { details: statusDetails }
                });
                //this.props.history.push(`/case/${caseTrackingId}`)
            }
        })
        .catch(error => {
            errors(this, error);
        })
  }

  render() {
    let authDetails = this.props.userDetails;
    return (
        <I18n ns="translations">
        {
          (t, { i18n }) => (
            <div className="view-box animated fadeIn">
                <ul className="listbox">
                {
                    (this.state.loading)
                        ?
                        (
                            <div>
                                <BoxLoader />
                                <BoxLoader />
                                <BoxLoader />
                            </div>
                        )
                        :
                        <MyEnhancedUpdateForm  authDetails={authDetails} callServer={(values) => this.updateTokenHOC(this.updateCase, values)} info={this.state.data} caseSubmitted={this.state.caseSubmitted} />
                }
                </ul>
            </div>
          )
        }
        </I18n>
    )
  }
}

export default translate('translations')(UpdateCase);
