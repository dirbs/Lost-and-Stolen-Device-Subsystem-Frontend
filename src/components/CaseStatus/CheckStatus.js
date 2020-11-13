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
import i18n from './../../i18n';
import { Button, Table } from 'reactstrap';
import { instance, errors, SweetAlert, getAuthHeader} from './../../utilities/helpers';

/**
 * This presentational component accepts some props and generate a informational component
 *
 * @param props
 * @returns {*}
 * @constructor
 */

class CheckStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      details: this.props.location.state.details,
      data: null
    }
  }
  
  handleDownloadFile = (values = null) => {
    const reportName = this.state.data.result.report_name;
    instance.post(`/download/${reportName}`, values, this.state.details.config)
    .then(response => {
      if (response.data) {
        let a = document.createElement("a");
        let file = new Blob([response.data], {type: 'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = 'lsds_failed_imeis';
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

  handleClick = () => {
    var textField = document.createElement('textarea')
    textField.innerText = this.state.details.id;
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()

    // instance.post(`/status/${this.state.details.id}`, values, this.state.details.config)
    //   .then(response => {
    //     if (response.data) {
    //       this.setState({ data: response.data });
    //     } else {
    //       SweetAlert({
    //         title: i18n.t('error'),
    //         message: i18n.t('somethingWentWrong'),
    //         type: 'error'
    //       })
    //     }
    //   })
    //   .catch(error => {
    //     errors(this, error);
    //   })
  }

  render() {
    const { details } = this.state;

    return (
      <div>
        <div className="submitted">
          <div className="icon-box">
            <i className={details.icon}></i>
          </div>
          <h4>{i18n.t('caseStatus.caseHasBeen')} <span>submitted</span> {i18n.t('caseStatus.successfully')}.</h4>
          <div className="msg">
            <p>{i18n.t('caseStatus.caseTrackingIDIs')} <span>{details.id}</span> {i18n.t('caseStatus.andStatusIs')} <span>{!this.state.data ? details.state : this.state.data.state}</span></p>
            <br/>
            {
              this.state.data &&
              <Table striped>
              <thead>
                <tr>
                  <th>Success</th>
                  <th>Failed</th>
                  <th>Notified</th>
                  <th>Report File</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.state.data.result.success}</td>
                  <td>{this.state.data.result.failed}</td>
                  <td>{this.state.data.result.notification_failed}</td>
                  <td>
                    <button onClick={this.handleDownloadFile}>{this.state.data.result.report_name}</button>
                  </td>
                </tr>
              </tbody>
            </Table>
            }
          </div>
          {!this.state.data
            ? <div>
              <p>Please click the button below to check status.</p>
              <div className="link-box">
                <Button color="primary" onClick={() => this.handleClick()}>Copy Tracking ID to Clipboard</Button>
              </div>
            </div>
            : <div>{this.state.data.result.result}</div>
          }
        </div>
      </div>
    )
  }
}

export default CheckStatus;
