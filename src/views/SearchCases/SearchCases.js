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
import { translate, I18n } from 'react-i18next';
import {Row, Col, Button, Form, Input, Label, FormGroup, Card, CardHeader, CardBody} from 'reactstrap';
import { withFormik, Field } from 'formik';
// Date Picker
import "react-dates/initialize";
import RenderDateRangePicker from "../../components/Form/RenderDateRangePicker";
import RenderDatePicker from "../../components/Form/RenderDatePicker";
import renderError from "../../components/Form/RenderError";
import renderInput from "../../components/Form/RenderInput";
import MultiSelect from "../../components/Form/MultiSelect";
import {instance, errors, getAuthHeader, languageCheck, fullNameCheck} from "../../utilities/helpers";
import {Date_Format, PAGE_LIMIT, ITEMS_PER_PAGE} from '../../utilities/constants';
import BoxLoader from '../../components/BoxLoader/BoxLoader';
import Pagination from "react-js-pagination";
import CaseBox from '../../components/CaseBox/CaseBox';
import moment from "moment";
import DataTableInfo from '../../components/DataTable/DataTableInfo';
import SearchFilters from "./SearchFilters";
import i18n from './../../i18n';

/**
 * This Stateful component generates a list of all Cases with required filters.
 * It uses some other components components to fulfill its task, like CaseBox component, Pagination and loader component.
 */
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.incidentDate = React.createRef();
    this.lastUpdated = React.createRef();
    this.handleResetForm = this.handleResetForm.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleReset(filter) {
    switch(filter.name) {
      case 'tracking_id':
        this.props.setFieldValue('tracking_id','')
        this.props.delSearchQuery(this.props.currSearchQuery,filter);
        break;
      case 'status':
        this.props.setFieldValue('status','')
        this.props.delSearchQuery(this.props.currSearchQuery,filter);
        break;
      case 'updated_at':
        this.lastUpdated.resetDate()
        this.props.setFieldValue('updated_at', '')
        this.props.delSearchQuery(this.props.currSearchQuery,filter)
        break;
      case 'imeis':
        this.props.setFieldValue('imeis','')
        this.props.delSearchQuery(this.props.currSearchQuery,filter)
        break;
      case 'msisdns':
        this.props.setFieldValue('msisdns','')
        this.props.delSearchQuery(this.props.currSearchQuery,filter)
        break;
      case 'address':
        this.props.setFieldValue('address','')
        this.props.delSearchQuery(this.props.currSearchQuery,filter)
        break;
      case 'gin':
        this.props.setFieldValue('gin','')
        this.props.delSearchQuery(this.props.currSearchQuery,filter)
        break;
      case 'full_name':
        this.props.setFieldValue('full_name','')
        this.props.delSearchQuery(this.props.currSearchQuery,filter)
        break;
      case 'dob':
        this.birthDate.resetDate()
        this.props.setFieldValue('dob', '')
        this.props.delSearchQuery(this.props.currSearchQuery,filter)
        break;
      case 'alternate_number':
        this.props.setFieldValue('alternate_number','')
        this.props.delSearchQuery(this.props.currSearchQuery,filter)
        break;
      case 'email':
        this.props.setFieldValue('email','')
        this.props.delSearchQuery(this.props.currSearchQuery,filter)
        break;
      case 'incident':
        this.props.setFieldValue('incident','')
        this.props.delSearchQuery(this.props.currSearchQuery,filter)
        break;
      case 'date_of_incident':
        this.incidentDate.resetDate()
        this.props.setFieldValue('date_of_incident', '')
        this.props.delSearchQuery(this.props.currSearchQuery,filter)
        break;
      case 'brand':
        this.props.setFieldValue('brand','')
        this.props.delSearchQuery(this.props.currSearchQuery,filter)
        break;
      case 'model':
        this.props.setFieldValue('model','')
        this.props.delSearchQuery(this.props.currSearchQuery,filter)
        break;
      case 'description':
        this.props.setFieldValue('description','')
        this.props.delSearchQuery(this.props.currSearchQuery,filter)
        break;
      default:
        break;
    }
  }

  handleResetForm(){
    this.incidentDate.resetDate()
    this.lastUpdated.resetDate()
    this.birthDate.resetDate()
    this.props.resetForm()
    this.props.delSearchQuery(this.props.currSearchQuery,'all')
  }

  render() {
    const {
      values,
      showFilters,
      toggle,
      touched,
      errors,
      isSubmitting,
      handleSubmit,
      setFieldValue,
      setFieldTouched,
      dirty,
      currSearchQuery
    } = this.props;
    return (
      <Form onSubmit={handleSubmit}>
        {(currSearchQuery.length > 0) &&
        <div>
          <div className='selected-filters-header'>
            <Button color="link" onClick={() => { this.handleResetForm(); }} disabled={!dirty || isSubmitting}>{i18n.t('button.clearAll')}</Button>
          </div>
          <SearchFilters filters={currSearchQuery} handleReset={this.handleReset}/>
          <hr />
        </div>
        }
        <Row className="justify-content-end">
          <Col xs={12} sm={6} xl={3}>
            <Field name="tracking_id" component={renderInput} type="text" label={i18n.t('caseBox.caseIdentifier')}
                   placeholder={i18n.t('caseBox.caseIdentifier')}/>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <FormGroup>
              <Label>{i18n.t('caseBox.lastUpdated')}</Label>
              <RenderDateRangePicker
                name="updated_at"
                ref={instance => { this.lastUpdated = instance; }}
                value={values.updated_at}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <FormGroup>
              <Label>{i18n.t('caseBox.caseStatus')}</Label>
              <div className="selectbox">
                <Field component="select" name="status" className="form-control">
                  <option value="">{i18n.t('caseStatus.selectStatus')}</option>
                  <option value="Pending">{i18n.t('caseStatus.pending')}</option>
                  <option value="Blocked">{i18n.t('caseStatus.blocked')}</option>
                  <option value="Recovered">{i18n.t('caseStatus.recovered')}</option>
                </Field>
              </div>
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <FormGroup>
              <MultiSelect
                value={values.msisdns}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                error={errors.msisdns}
                touched={touched.msisdns}
                fieldName="msisdns"
                label={i18n.t('newCase.affectedMSISDNs')}
                placeholder={i18n.t('msisdnInput.placeholder')}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row className={toggle ? 'collapse show' : 'collapse'}>
          <Col xs={12} sm={6} xl={3}>
            <FormGroup>
              <MultiSelect
                value={values.imeis}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                error={errors.imeis}
                touched={touched.imeis}
                fieldName="imeis"
                label={i18n.t('newCase.affectedIMEIs')}
                placeholder={i18n.t('imeiInput.placeholder')}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <FormGroup>
              <Label>{i18n.t('newCase.incidentNature')}</Label>
              <div className="selectbox">
                <Field component="select" name="incident" className="form-control">
                  <option value="">{i18n.t('incidentNature.selectNature')}</option>
                  <option value="lost">{i18n.t('incidentNature.lost')}</option>
                  <option value="stolen">{i18n.t('incidentNature.stolen')}</option>
                </Field>
              </div>
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <FormGroup>
              <Label>{i18n.t('newCase.incidentDate')}</Label>
              <RenderDateRangePicker
                name="date_of_incident"
                ref={instance => { this.incidentDate = instance; }}
                value={values.date_of_incident}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Field name="full_name" component={renderInput} type="text" label={i18n.t('userProfile.fullName')} placeholder={i18n.t('userProfile.fullName')}/>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Field name="gin" component={renderInput} type="text" label={i18n.t('userProfile.gin')}
                   placeholder={i18n.t('userProfile.gin')}/>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Field name="email" component={renderInput} type="text" label={i18n.t('userProfile.email')}
                   placeholder={i18n.t('userProfile.email')}/>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <FormGroup>
              <Label>{i18n.t('userProfile.dob')}</Label>
              <RenderDatePicker
                name="dob"
                ref={instance => { this.birthDate = instance; }}
                value={values.dob}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
              />
              <Field name="dob" component={renderError}/>
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Field name="address" component={renderInput} type="text" label={i18n.t('userProfile.address')} placeholder={i18n.t('userProfile.address')}/>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Field name="alternate_number" component={renderInput} type="text" label={i18n.t('userProfile.alternatePhoneNo')}
                   placeholder={i18n.t('userProfile.alternatePhoneNo')}/>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Field name="brand" component={renderInput} type="text" label={i18n.t('newCase.deviceBrand')} placeholder={i18n.t('newCase.deviceBrand')}/>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Field name="model" component={renderInput} type="text" label={i18n.t('newCase.deviceModelName')} placeholder={i18n.t('newCase.deviceModelName')}/>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Field name="description" component={renderInput} type="text" label={i18n.t('newCase.devicePhysical')}
                   placeholder={i18n.t('newCase.devicePhysical')}/>
          </Col>
        </Row>
        <Row className="justify-content-end">
          <Col xs={12} sm={6} md={4} xl={3}>
            <FormGroup>
              <Button color="default" block
                      onClick={showFilters} title={toggle ? `${i18n.t('button.hideMoreFilters')}` : `${i18n.t('button.showMoreFilters')}`}>{toggle ? `${i18n.t('button.hideMoreFilters')}` : `${i18n.t('button.showMoreFilters')}`}</Button>
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={4} xl={3}>
            <Button color="primary" type="submit" block disabled={isSubmitting}>{i18n.t('button.searchCases')}</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const MyEnhancedForm = withFormik({
  mapPropsToValues: () => ({ "tracking_id": "", "status": "", "updated_at": "", "imeis": [], "msisdns": [], "address": "", "gin": "", "full_name": "", "dob": "", "alternate_number": "", "email": "", "incident": "", "date_of_incident": "", "brand": "", "model": "", "description": "" }),

  // Custom sync validation
  validate: values => {
    let errors = {};
    let today = moment().format(Date_Format);
    let paste =  moment('1900-01-01').format(Date_Format);
    if (!values.dob) {
    } else if (today < values.dob) {
      errors.dob = `${i18n.t('forms.dobErrorFuture')}`;
    } else if (paste >= values.dob) {
      errors.dob = `${i18n.t('forms.dobErrorOld')}`;
    }
    if (!values.email) {

    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
        values.email
      )
    ) {
      errors.email = `${i18n.t('forms.emailInvalid')}`;
    }
    if (values.full_name && fullNameCheck(values.full_name) === false){
        errors.full_name = i18n.t('forms.langError')
    }
      if (values.address && languageCheck(values.address) === false){
          errors.address = i18n.t('forms.langError')
      }
      if (values.brand && languageCheck(values.brand) === false){
          errors.brand = i18n.t('forms.langError')
      }if (values.model && languageCheck(values.model) === false){
          errors.model = i18n.t('forms.langError')
      }if (values.description && languageCheck(values.description) === false){
          errors.description = i18n.t('forms.langError')
      }
    return errors;
  },

  handleSubmit: (values, bag) => {
    bag.setSubmitting(false);
    bag.props.callServer(prepareAPIRequest(values));
    bag.props.searchQuery(prepareAPIRequest(values));
  },

  displayName: 'SearchForm', // helps with React DevTools
})(SearchForm);

function prepareAPIRequest(values) {
    // Validate Values before sending
    const searchParams = {};
    if(values.tracking_id) {
        searchParams.tracking_id = values.tracking_id
    }
    if(values.status) {
        searchParams.status = values.status
    }
    if(values.msisdns.length > 0) {
      searchParams.msisdns = [];
      for (let i=0; i< values.msisdns.length; i++) {
        searchParams.msisdns[i] = values.msisdns[i].value;
      }
    }
    if(values.imeis.length > 0) {
      searchParams.imeis = [];
      for (let i=0; i< values.imeis.length; i++) {
        searchParams.imeis[i] = values.imeis[i].value;
      }
    }
    if(values.updated_at) {
        searchParams.updated_at = values.updated_at
    }
    if(values.address) {
        searchParams.address = values.address
    }
    if(values.gin) {
        searchParams.gin = values.gin
    }
    if(values.full_name) {
        searchParams.full_name = values.full_name
    }
    if(values.dob) {
        searchParams.dob = values.dob
    }
    if(values.alternate_number) {
        searchParams.alternate_number = values.alternate_number
    }
    if(values.email) {
        searchParams.email = values.email
    }
    if(values.incident) {
        searchParams.incident = values.incident
    }
    if(values.date_of_incident) {
        searchParams.date_of_incident = values.date_of_incident
    }
    if(values.brand) {
        searchParams.brand = values.brand
    }
    if(values.model) {
        searchParams.model = values.model
    }
    if(values.description) {
        searchParams.description = values.description
    }
    return searchParams;
}

class SearchCases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAllFilters: false,
      start: 1,
      limit: PAGE_LIMIT,
      data: null,
      loading: false,
      activePage: 1,
      totalCases: 0,
      searchQuery: {},
      apiFetched: false,
      currSearchQuery: [],
      options: ITEMS_PER_PAGE
    }
    this.handleShowFilters = this.handleShowFilters.bind(this);
    this.getSearchCasesFromServer = this.getSearchCasesFromServer.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.saveSearchQuery = this.saveSearchQuery.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.setSearchQuery = this.setSearchQuery.bind(this);
    this.delSearchQuery = this.delSearchQuery.bind(this);
  }

  isBottom(el) {
    return el.getBoundingClientRect().bottom - 100 <= window.innerHeight;
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handlePagination);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handlePagination);
  }

  handlePagination = () => {
    const wrappedElement = document.getElementById('root');
    if (this.isBottom(wrappedElement)) {
      document.body.classList.remove('pagination-fixed');
    } else {
      document.body.classList.add('pagination-fixed');
    }
  };

  updateTokenHOC(callingFunc) {
      let config = null;
      if(this.props.kc.isTokenExpired(0)) {
          this.props.kc.updateToken(0)
              .success(() => {
                  localStorage.setItem('token', this.props.kc.token)
                  config = {
                    headers: getAuthHeader(this.props.kc.token)
                  }
                  callingFunc(config);
              })
              .error(() => this.props.kc.logout());
      } else {
          config = {
            headers: getAuthHeader()
          }
          callingFunc(config);
      }
  }

  saveSearchQuery(values) {
    this.setState({ searchQuery: values, loading: true, showAllFilters: false, data: null, apiFetched: true, start: 1, activePage: 1} , () => {
      this.updateTokenHOC(this.getSearchCasesFromServer);
	})
  }
  handlePageClick(page) {
    let a1 = 1;
    let d = this.state.limit;
   	let start = a1 + d * (page - 1);

	this.setState({start: start, activePage: page, loading: true}, () => {
	  this.updateTokenHOC(this.getSearchCasesFromServer);
	});
  }

  handleLimitChange = (e) => {
    e.preventDefault();
    let limit = parseInt(e.target.value);
    let currentPage = Math.ceil(this.state.start / limit);
    this.setState({limit: limit},()=>{
      this.handlePageClick(currentPage);
    });
  }

  getSearchCasesFromServer(config) {
      let start = this.state.start;
      let limit = this.state.limit;
      const searchQuery = this.state.searchQuery;
      const postSearchData = {
        "start": start,
        "limit": limit,
        "search_args": searchQuery
      }
      instance.post('/search?start='+start+'&limit='+limit, postSearchData, config)
          .then(response => {
              if(response.data.message) {
                this.setState({ loading: false });
              } else {
                this.setState({ data: response.data, totalCases: (response.data || {}).count, loading: false});
              }
          })
          .catch(error => {
              errors(this, error);
          })
  }

  handleShowFilters() {
    this.setState({ showAllFilters: !this.state.showAllFilters })
  }

  setSearchQuery(values){
    let query = []
    Object.keys(values).map((key, index)=>{
        switch(key){
          case 'tracking_id':
            query.push(
                {name: key, id: index, label: `${i18n.t('caseBox.caseIdentifier')}`, value: values[key]})
            break;
          case 'status':
            query.push(
                {name: key, id: index, label: `${i18n.t('caseBox.caseStatus')}`, value: values[key]})
            break;
          case 'updated_at':
            query.push(
                {name: key, id: index, label: `${i18n.t('caseBox.lastUpdated')}`, value: values[key]})
            break;
          case 'imeis':
            values[key].map((imei,i)=>{
              return query.push(
                  {
                    name: key,
                    id: `imei${i}`,
                    label: `${i18n.t('newCase.affectedIMEIs')} ${i+1}`,
                    value: values[key][i]
                  })
            })
            break;
          case 'msisdns':
            values[key].map((msisdn,i)=>{
              return query.push(
                {
                  name: key,
                  id: `msisdn${i}`,
                  label: `${i18n.t('newCase.affectedMSISDNs')} ${i+1}`,
                  value: values[key][i]
                })
            })
            break;
          case 'address':
            query.push(
                {name: key, id: index, label: `${i18n.t('userProfile.address')}`, value: values[key]})
            break;
          case 'gin':
            query.push(
                {name: key, id: index, label: `${i18n.t('userProfile.gin')}`, value: values[key]})
            break;
          case 'full_name':
            query.push(
                {name: key, id: index, label: `${i18n.t('userProfile.fullName')}`, value: values[key]})
            break;
          case 'dob':
            query.push(
                {name: key, id: index, label: `${i18n.t('userProfile.dob')}`, value: values[key]})
            break;
          case 'alternate_number':
            query.push(
                {name: key, id: index, label: `${i18n.t('userProfile.alternatePhoneNo')}`, value: values[key]})
            break;
          case 'email':
            query.push(
                {name: key, id: index, label: `${i18n.t('userProfile.email')}`, value: values[key]})
            break;
          case 'incident':
            query.push(
                {name: key, id: index, label: `${i18n.t('newCase.incidentNature')}`, value: values[key]})
            break;
          case 'date_of_incident':
            query.push(
                {name: key, id: index, label: `${i18n.t('newCase.incidentDate')}`, value: values[key]})
            break;
          case 'brand':
            query.push(
                {name: key, id: index, label: `${i18n.t('newCase.deviceBrand')}`, value: values[key]})
            break;
          case 'model':
            query.push(
                {name: key, id: index, label: `${i18n.t('newCase.deviceModelName')}`, value: values[key]})
            break;
          case 'description':
            query.push(
                {name: key, id: index, label: `${i18n.t('newCase.devicePhysical')}`, value: values[key]})
            break;
          default:
            break;
        }
      return ''
    })
    this.setState({
      currSearchQuery: query
    })
  }

  delSearchQuery(filters,selectedFilter) {
    let searchQuery = this.state.searchQuery
    if (selectedFilter === 'all') {
      this.setState({
        currSearchQuery: [],
        searchQuery:{}
      })
    } else {
      let query = filters.filter((el) => {
        return el.id !== selectedFilter.id
      })
      delete searchQuery[selectedFilter.value]
      this.setState({
        searchQuery,
        currSearchQuery: query
      })
    }
  }

  render() {
    const {options} = this.state;
    const limitOptions = options.map((item)=>{
      return <option key={item.value} value={item.value}>{item.label}</option>
    })
    let searched_cases = null;
    if(((this.state.data || {}).cases || []).length > 0) {
      searched_cases = this.state.data.cases.map(searched_case => (
          <CaseBox userDetails={this.props.userDetails} info={searched_case} key={searched_case.tracking_id} handleCaseStatus={this.props.handleCaseStatus} />
      ));
    }
    return (
        <I18n ns="translations">
        {
          (t, { i18n }) => (
            <div className="search-box animated fadeIn">
              <div className="filters">
                <Card>
                  <CardHeader>
                    <b>{i18n.t('searchPag.searchFilters')}</b>
                  </CardHeader>
                  <CardBody>
                    <MyEnhancedForm showFilters={this.handleShowFilters} toggle={this.state.showAllFilters}
                                    callServer={this.saveSearchQuery} searchQuery={this.setSearchQuery}
                                    delSearchQuery={this.delSearchQuery}
                                    currSearchQuery={this.state.currSearchQuery}/>
                  </CardBody>
                </Card>
              </div>
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
                    : ((this.state.data || {}).cases || []).length > 0
                    ? <div>
                        <Card className="mb-1">
                            <CardHeader className="border-bottom-0">
                                <b className="text-primary">{(this.state.totalCases > 1) ? `${this.state.totalCases} ${i18n.t('searchPag.casesFound')}`: `${this.state.totalCases} ${i18n.t('searchPag.caseFound')}`}</b>
                            </CardHeader>
                        </Card>
                        {searched_cases}
                      </div>
                    : (this.state.apiFetched)
                    ?
                        <Card className="mb-1">
                            <CardHeader className="border-bottom-0">
                                <b className="text-danger">{i18n.t('searchPag.noCases')}</b>
                            </CardHeader>
                        </Card>
                        : null
              }
              </ul>

              {(((this.state.data || {}).cases || []).length > 0 && this.state.totalCases > PAGE_LIMIT && !(this.state.loading)) &&
                <article className='data-footer'>
                  <Pagination
                    pageRangeDisplayed={window.matchMedia("(max-width: 767px)").matches ? 4 : 10}
                    activePage={this.state.activePage}
                    itemsCountPerPage={this.state.limit}
                    totalItemsCount={this.state.totalCases}
                    onChange={this.handlePageClick}
                    innerClass="pagination"
                  />
                  <div className="hand-limit">
                    <Label>{i18n.t('pageRecordLimit.show')}</Label>
                    <div className="selectbox">
                      <Input value={this.state.limit} onChange={(e) => {
                        this.handleLimitChange(e)
                      }} type="select" name="select">
                        {limitOptions}
                      </Input>
                    </div>
                    <Label>{i18n.t('pageRecordLimit.cases')}</Label>
                  </div>
                  <div className='start-toend'>
                    <DataTableInfo start={this.state.start} limit={this.state.limit} total={this.state.totalCases} itemType={i18n.t('searchPag.itemType')} />
                  </div>
                </article>
              }
            </div>
          )
        }
        </I18n>
    )
  }
}

export default translate('translations')(SearchCases);
