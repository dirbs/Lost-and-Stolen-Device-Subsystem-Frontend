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
import {instance, errors, getAuthHeader} from './../../../utilities/helpers';
import CaseBox from '../../../components/CaseBox/CaseBox';
import BoxLoader from '../../../components/BoxLoader/BoxLoader';
import Pagination from "react-js-pagination";
import {PAGE_LIMIT, RECOVERED_CASE, ITEMS_PER_PAGE} from '../../../utilities/constants';
import {Card, CardHeader, Input, Label} from 'reactstrap';
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
    this.handleLimitChange = this.handleLimitChange.bind(this);
    this.handlePagination = this.handlePagination.bind(this);

    this.state = {
      activePage: 1,
      data: null,
      loading: true,
      totalCases: 0,
      start: 1,
      limit: PAGE_LIMIT,
      options: ITEMS_PER_PAGE
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

    this.setState({start: start, activePage: page, loading: true}, () => {
      this.updateTokenHOC(this.getCasesFromServer);
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

  isBottom(el) {
    return el.getBoundingClientRect().bottom - 100 <= window.innerHeight;
  }

  componentDidMount() {
    this.updateTokenHOC(this.getCasesFromServer);
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
  }
  render() {
    const {options} = this.state;
    const limitOptions = options.map((item)=>{
      return <option key={item.value} value={item.value}>{item.label}</option>
    })
    let recovered_cases = null;
    if(((this.state.data || {}).cases || []).length > 0) {
        recovered_cases = this.state.data.cases.map(recovered => (
            <CaseBox userDetails={this.props.userDetails} creator={recovered.creator} info={recovered} key={recovered.tracking_id}/>
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
                                        <b className="text-primary">{(this.state.totalCases > 1) ? `${this.state.totalCases} ${i18n.t('recoveredCasesRecord.casesFound')}`: `${this.state.totalCases} ${i18n.t('recoveredCasesRecord.caseFound')}`}</b>
                                    </CardHeader>
                                </Card>
                                {recovered_cases}
                            </div>
                            : `${i18n.t('recoveredCasesRecord.noCases')}`
                  }
              </ul>
              {(((this.state.data || {}).cases || []).length > 0 && this.state.totalCases > PAGE_LIMIT && !(this.state.loading)) &&
                <article className="data-footer">
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
                    <DataTableInfo start={this.state.start} limit={this.state.limit} total={this.state.totalCases} itemType={i18n.t('pageRecordLimit.itemType')} />
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

export default translate('translations')(Recovered);
