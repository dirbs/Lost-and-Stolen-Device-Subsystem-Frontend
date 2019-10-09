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
import { translate, I18n } from 'react-i18next';
import DashboardInstructions from './instructions';
import { instance, errors, getAuthHeader } from './../../utilities/helpers';
import CaseBox from '../../components/CaseBox/CaseBox';
import BoxLoader from '../../components/BoxLoader/BoxLoader';
import {PENDING_CASE, PAGE_LIMIT} from '../../utilities/constants';
import {Card, CardHeader, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import RenderModal from '../../components/Form/RenderModal'

/**
 * This Stateful component generates a list of all Pending Cases.
 * It uses some other components to fulfill its task, like CaseBox component, Pagination and loader component.
 */
class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.getCasesFromServer = this.getCasesFromServer.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
    this.infoClickHandler = this.infoClickHandler.bind(this);

    this.state = {
      activePage: 1,
      data: null,
      loading: true,
      totalCases: 0,
      start: 1,
      limit: PAGE_LIMIT,
      showInstructionModal: false
    }
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

  getCasesFromServer(config) {
      let start = this.state.start;
      let limit = this.state.limit;
      instance.get(`cases?status=${PENDING_CASE}&start=${start}&limit=${limit}`, config)
          .then(response => {
              this.setState({ data: response.data, totalCases: (response.data || {}).count, loading: false});
          })
          .catch(error => {
              errors(this, error);
          })
  }

  componentDidMount() {
    this.updateTokenHOC(this.getCasesFromServer);
  }

  infoClickHandler() {
    this.setState({
        showInstructionModal : true
    })
  }

  render() {
    let pending_cases = null;
    if(((this.state.data || {}).cases || []).length > 0) {
        pending_cases = this.state.data.cases.map(pending => (
            <CaseBox info={pending} key={pending.tracking_id} handleCaseStatus={this.props.handleCaseStatus} />
        ));
    }
    return (
        <I18n ns="translations">
        {
          (t, { i18n }) => (
              <div className="search-box animated fadeIn position-relative">
                  <div className="help help-page">
                      <button onClick={()=>this.infoClickHandler()}>
                          <svg className="icon-registration">
                              <use xlinkHref="./img/svg-symbol.svg#helpi"></use>
                          </svg>
                      </button>
                  </div>
                  <ul className="listbox">
                      {
                        (this.state.loading)
                          ? (
                              <div>
                                <BoxLoader />
                                <BoxLoader />
                                <BoxLoader />
                              </div>
                            )
                          : ((this.state.data || []).cases || {}).length > 0
                            ?
                                <div>
                                    <Card className="mb-3">
                                        <CardHeader className="border-bottom-0">
                                            <b>{i18n.t('pendingCasesRecord.recentCases')}</b>
                                        </CardHeader>
                                    </Card>
                                    {pending_cases}
                                </div>: `${i18n.t('pendingCasesRecord.noCases')}`
                      }
                  </ul>
                  <RenderModal show={this.state.showInstructionModal} className="modal-lg modal-dirbs">
                      <ModalHeader><b>{i18n.t('dashboard.instructions')}</b></ModalHeader>
                      <ModalBody>
                          <DashboardInstructions />
                      </ModalBody>
                      <ModalFooter>
                          <button className="btn btn-secondary" onClick={()=>this.setState({showInstructionModal:false})}>{i18n.t('button.close')}</button>
                      </ModalFooter>
                  </RenderModal>
              </div>
          )
        }
        </I18n>
    )
  }
}

export default translate('translations')(Dashboard);
