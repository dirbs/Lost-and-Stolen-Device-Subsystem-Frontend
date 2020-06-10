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
import i18n from './../../../i18n';
import { instance, errors, SweetAlert, getAuthHeader } from './../../../utilities/helpers';
import { Row, Col, Button, Table, Input, Label } from 'reactstrap';

/**
 * This presentational component accepts some props and generate a informational component
 *
 * @param props
 * @returns {*}
 * @constructor
 */

class SearchStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      trackingId: "",
      error: ""
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

  handleTextChange = (e) => {
    this.setState({ trackingId: e.target.value });
  }

  handleDownloadFile = (config) => {
    const reportName = this.state.data.result.report_name;
    instance.post(`/download/${reportName}`, config)
      .then(response => {
        if (response.data) {
          let a = document.createElement("a");
          let file = new Blob([response.data], { type: 'text/plain' });
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

  handleClick = (config) => {
    if(this.state.trackingId !== ""){
    this.setState({error: ""});
    instance.post(`/status/${this.state.trackingId}`, null, config)
      .then(response => {
        if (response.data) {
          this.setState({ data: response.data });
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
    else
    {
      this.setState({error: "This field is required"});
    }
  }

  render() {

    return (
      <div>
          <Col xs={12} sm={12} xl={6}>
          <br/>
          <Label>Enter Tracking ID<span className="text-danger">*</span></Label>
          <Input value={this.state.trackingId} onChange={(e) => {
            this.handleTextChange(e)
          }} type="text" name="trkId" />
          {this.state.error && <span className="text-danger">* {this.state.error}</span>}
          </Col>
          <br/>
          <div className="link-box ml-3">
            <Button color="primary" onClick={() => this.updateTokenHOC(this.handleClick)}>Check Status</Button>
          </div>
          <br/>
          {this.state.data && 
          <div className="msgSearch ml-3">
            <p>Status for Tracking ID: <span>{this.state.trackingId}</span> is <span>{this.state.data.state}</span></p>
            <br />
            {this.state.data.result && 
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
                      <button onClick={() => this.updateTokenHOC(this.handleDownloadFile)}>{this.state.data.result.report_name}</button>
                    </td>
                  </tr>
                </tbody>
              </Table>
              }
          </div>
          }
        </div>
    )
  }
}

export default SearchStatus;
