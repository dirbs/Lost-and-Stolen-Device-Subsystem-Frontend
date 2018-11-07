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
import {instance, errors, getAuthHeader} from './../../../utilities/helpers';
import CaseBox from '../../../components/CaseBox/CaseBox';
import BoxLoader from '../../../components/BoxLoader/BoxLoader';
import Pagination from "react-js-pagination";
import {PAGE_LIMIT, RECOVERED_CASE} from '../../../utilities/constants';
import {Card, CardHeader, Row, Col} from 'reactstrap';
import DataTableInfo from '../../../components/DataTable/DataTableInfo';

/**
 * This Stateful component generates a list of all Recovered Cases.
 * It uses some other components to fulfill its task, like CaseBox component, Pagination and loader component.
 */
class Recovered extends Component {
  constructor(props) {
    super(props);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.getCasesFromServer = this.getCasesFromServer.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);

    this.state = {
      activePage: 1,
      data: null,
      loading: true,
      totalCases: 0,
      start: 1,
      limit: PAGE_LIMIT
    }
  }
  getCasesFromServer(config) {
      let start = this.state.start;
      let limit = this.state.limit;
      instance.get(`/cases?status=${RECOVERED_CASE}&start=${start}&limit=${limit}`, config)
          .then(response => {
              this.setState({ data: response.data, totalCases: (response.data || {}).count, loading: false});
          })
          .catch(error => {
              errors(this, error);
          })
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

  handlePageClick(page) {
    let a1 = 1;
    let d = this.state.limit;
   	let start = a1 + d * (page - 1);

	this.setState({start: start, activePage: page}, () => {
	  this.updateTokenHOC(this.getCasesFromServer);
	});
  }
  componentDidMount() {
    this.updateTokenHOC(this.getCasesFromServer);
  }
  render() {
    let recovered_cases = null;
    if(((this.state.data || {}).cases || []).length > 0) {
        recovered_cases = this.state.data.cases.map(recovered => (
            <CaseBox info={recovered} key={recovered.tracking_id}/>
        ));
    }
    return (
        <I18n ns="translations">
        {
          (t, { i18n }) => (
            <div className="animated fadeIn">
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
                            ?  <div>
                                <Card className="mb-3">
                                    <CardHeader className="border-bottom-0">
                                        <b className="text-primary">{(this.state.totalCases > 1) ? `${this.state.totalCases} Recovered Cases found`: `${this.state.totalCases} Recovered Case found`}</b>
                                    </CardHeader>
                                </Card>
                                {recovered_cases}
                            </div>
                            : 'No Recovered Cases found'
                  }
              </ul>
              <Row>
                  <Col className='col-xs-12 col-xl-6'>
                    {(((this.state.data || {}).cases || []).length > 0 && this.state.totalCases > PAGE_LIMIT) &&
                      <div className='mt-3'>
                        <DataTableInfo start={this.state.start} limit={this.state.limit} total={this.state.totalCases} itemType={'cases'} />
                      </div>
                    }
                  </Col>
                {((((this.state.data || {}).cases || []).length > 0  && this.state.totalCases > PAGE_LIMIT) &&
                  <Col className='col-xs-12 col-xl-6'>
                  <Pagination
                      pageRangeDisplayed={window.matchMedia("(max-width: 575px)").matches ? 4 : 10}
                      activePage={this.state.activePage}
                      itemsCountPerPage={this.state.limit}
                      totalItemsCount={this.state.totalCases}
                      onChange={this.handlePageClick}
                      innerClass="pagination float-right mt-3"
                    /></Col>) || <div className="mb-3"></div>}
              </Row>
            </div>
          )
        }
        </I18n>
    )
  }
}

export default translate('translations')(Recovered);
