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
import { translate, I18n } from 'react-i18next';
import {Row, Col, Button, Form, Label, FormGroup, Card, CardHeader, CardBody} from 'reactstrap';
import { withFormik, Field } from 'formik';
// Date Picker
import "react-dates/initialize";
import RenderDateRangePicker from "../../components/Form/RenderDateRangePicker";
import RenderDatePicker from "../../components/Form/RenderDatePicker";
import renderError from "../../components/Form/RenderError";
import renderInput from "../../components/Form/RenderInput";
import MultiSelect from "../../components/Form/MultiSelect";
import "react-dates/lib/css/_datepicker.css";
import { instance, errors, getAuthHeader } from "../../utilities/helpers";
import {Date_Format, PAGE_LIMIT} from '../../utilities/constants';
import BoxLoader from '../../components/BoxLoader/BoxLoader';
import Pagination from "react-js-pagination";
import CaseBox from '../../components/CaseBox/CaseBox';
import moment from "moment";
import DataTableInfo from '../../components/DataTable/DataTableInfo';

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
  }

  handleResetForm(){
    this.incidentDate.resetDate()
    this.lastUpdated.resetDate()
    this.birthDate.resetDate()
    this.props.resetForm()
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
    } = this.props;
    return (
      <Form onSubmit={handleSubmit}>
        <Row className="justify-content-end">
          <Col xs={12} sm={6} xl={3}>
            <Field name="tracking_id" component={renderInput} type="text" label="Case Identifier"
                   placeholder="Case Identifier"/>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <FormGroup>
              <Label>Last Updated</Label>
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
              <Label> Case Status </Label>
              <div className="selectbox">
                <Field component="select" name="status" className="form-control">
                  <option value="">Select Case status</option>
                  <option value="Pending">Pending</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Recovered">Recovered</option>
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
                label="Affected MSISDNs"
                placeholder="Type MSISDN and Press Enter"
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
                label="Affected IMEIs"
                placeholder="Type IMEI and Press Enter"
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <FormGroup>
              <Label> Nature of Incident </Label>
              <div className="selectbox">
                <Field component="select" name="incident" className="form-control">
                  <option value="">Select Case Incident</option>
                  <option value="lost">Lost</option>
                  <option value="stolen">Stolen</option>
                </Field>
              </div>
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <FormGroup>
              <Label>Date of Incident</Label>
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
            <Field name="full_name" component={renderInput} type="text" label="Full Name" placeholder="Full Name"/>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Field name="gin" component={renderInput} type="text" label="Govt. Identification No."
                   placeholder="Govt. Identification No."/>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Field name="email" component={renderInput} type="text" label="E-mail Address"
                   placeholder="E-mail Address"/>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <FormGroup>
              <Label>Date of Birth</Label>
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
            <Field name="address" component={renderInput} type="text" label="Address" placeholder="Address"/>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Field name="alternate_number" component={renderInput} type="text" label="Alternate Phone Number"
                   placeholder="Alternate Phone number"/>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Field name="brand" component={renderInput} type="text" label="Brand" placeholder="Brand"/>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Field name="model" component={renderInput} type="text" label="Model Name" placeholder="Model Name"/>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Field name="description" component={renderInput} type="text" label="Physical Description"
                   placeholder="Physical Description"/>
          </Col>
        </Row>
        <Row className="justify-content-end">
          <Col xs={12} sm={6} md={4} xl={3}>
            <FormGroup>
              <Button color="default" onClick={() => { this.handleResetForm(); }} disabled={!dirty || isSubmitting} block>
                Clear Search
              </Button>
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={4} xl={3}>
            <FormGroup>
              <Button color="default" block
                      onClick={showFilters}>{toggle ? 'Hide More Filters' : 'Show More Filters'}</Button>
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={4} xl={3}>
            <Button color="primary" type="submit" block disabled={isSubmitting}>Search Cases</Button>
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
      errors.dob = 'Date of birth can\'t be in future';
    } else if (paste >= values.dob) {
      errors.dob = 'Date of birth can\'t be in that old';
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
    bag.props.callServer(prepareAPIRequest(values));
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
      apiFetched: false
    }
    this.handleShowFilters = this.handleShowFilters.bind(this);
    this.getSearchCasesFromServer = this.getSearchCasesFromServer.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.saveSearchQuery = this.saveSearchQuery.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
  }

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
  render() {
    let searched_cases = null;
    if(((this.state.data || {}).cases || []).length > 0) {
      searched_cases = this.state.data.cases.map(searched_case => (
          <CaseBox info={searched_case} key={searched_case.tracking_id} handleCaseStatus={this.props.handleCaseStatus} />
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
                    <b>Search Filters</b>
                  </CardHeader>
                  <CardBody>
                    <MyEnhancedForm showFilters={this.handleShowFilters} toggle={this.state.showAllFilters} callServer={this.saveSearchQuery}/>
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
                                <b className="text-primary">{(this.state.totalCases > 1) ? `${this.state.totalCases} Cases found`: `${this.state.totalCases} Case found`}</b>
                            </CardHeader>
                        </Card>
                        {searched_cases}
                      </div>
                    : (this.state.apiFetched)
                    ?
                        <Card className="mb-1">
                            <CardHeader className="border-bottom-0">
                                <b className="text-danger">No Cases Found</b>
                            </CardHeader>
                        </Card>
                        : null
              }
              </ul>

              <div className="row">

              <div className="col-xs-12 col-lg-6">
                {(((this.state.data || {}).cases || []).length > 0 && this.state.totalCases > PAGE_LIMIT) &&
                  <div className='mt-3'>
                    <DataTableInfo start={this.state.start} limit={this.state.limit} total={this.state.totalCases} itemType={'cases'} />
                  </div>
                }
              </div>

              {((((this.state.data || {}).cases || []).length > 0 && this.state.totalCases > PAGE_LIMIT) &&
              <div className="col-xs-12 col-lg-6">
                <Pagination
                  pageRangeDisplayed={window.matchMedia("(max-width: 767px)").matches ? 4 : 10}
                  activePage={this.state.activePage}
                  itemsCountPerPage={this.state.limit}
                  totalItemsCount={this.state.totalCases}
                  onChange={this.handlePageClick}
                  innerClass="pagination float-right mt-3"
                /></div>) || <div className="mb-3"></div>}
              </div>
            </div>
          )
        }
        </I18n>
    )
  }
}

export default translate('translations')(SearchCases);
