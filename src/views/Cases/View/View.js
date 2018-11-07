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
import {instance, errors, getAuthHeader} from './../../../utilities/helpers';
import {RECOVERED_CASE, BLOCKED_CASE} from './../../../utilities/constants';
import { Button, Row, Col, Card, CardBody, CardHeader} from 'reactstrap';
import BoxLoader from '../../../components/BoxLoader/BoxLoader';

/**
 * This Stateful component provides View functionality of a Case.
 */
class View extends Component {
  constructor(props) {
    super(props);

    this.getCaseFromServer = this.getCaseFromServer.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);

    this.state = {
        data: null,
        loading: true
    }
  }
  componentDidMount() {
    this.updateTokenHOC(this.getCaseFromServer);
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

  getCaseFromServer() {
      const {tracking_id} = this.props.match.params;
      var config = {
        headers: getAuthHeader()
      }
      instance.get(`/case/${tracking_id}`, config)
          .then(response => {
              this.setState({ data: response.data, loading: false});
          })
          .catch(error => {
              errors(this, error);
          })
  }

  render() {
    let view_case = null;
    if(this.state.data) {
        const {tracking_id, updated_at, status, device_details, incident_details, personal_details, comments, creator} = this.state.data;
        const statusClass =
        (status === 'Pending')
        ?
            'text-primary'
        : (status === 'Recovered')
            ? 'text-success'
            : 'text-danger';
        view_case = <div key={tracking_id}>
          <Row >
            <Col xs="12" lg="8">
              <h4>Case Identifier: {tracking_id} - <small>Status <span className={statusClass}>{status}</span></small></h4>
              <p className="last-updated mb-0">Creator: <b>{creator.username}</b></p>
              <p className="last-updated">Last updated: <b>{updated_at}</b></p>
            </Col>
              <Col xs="12" lg="4">
                  {(status === 'Pending') ?
                      <div className="text-right pb-4">
                        <Link className="btn-sm btn btn-primary"
                            to={`/case-update/${ tracking_id }`}>Update</Link>{' '}
                        <Button color="success" size="sm" onClick={(e) => this.props.handleCaseStatus(e, tracking_id, RECOVERED_CASE)}>Recover</Button>{' '}
                        <Button color="danger" size="sm" onClick={(e) => this.props.handleCaseStatus(e, tracking_id, BLOCKED_CASE)}>Block</Button>
                      </div>
                      : (status === 'Blocked') ?
                          <div className="text-right pb-4">
                            <Button color="success" size="sm" onClick={(e) => this.props.handleCaseStatus(e, tracking_id, RECOVERED_CASE)}>Recover</Button>
                          </div>
                      : ''
                  }
              </Col>
          </Row>
          <Row>
            <Col xs="12">
                <Card>
                    <CardHeader>
                        <b>Device Description</b>
                    </CardHeader>
                    <CardBody>
                        <table className="table table-bordered table-sm mb-0">
                            <tbody>
                                <tr>
                                    <th>Brand</th>
                                    <td>{device_details.brand}</td>
                                </tr>
                                <tr>
                                    <th>Model name</th>
                                    <td>{device_details.model_name}</td>
                                </tr>
                                <tr>
                                    <th>Physical description</th>
                                    <td>{device_details.description}</td>
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
                        <b>Affected MSISDN(s)</b>
                    </CardHeader>
                    <CardBody>
                        <table className="table table-bordered table-sm mb-0">
                            <tbody>
                            {device_details.msisdns.map((msisdn, index) => (
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
                        <b>Affected IMEI(s)</b>
                    </CardHeader>
                    <CardBody>
                        <table className="table table-bordered table-sm mb-0">
                            <tbody>
                            {device_details.imeis.map((imei, index) => (
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
              <Col xs="12" md="6">
                  <Card>
                    <CardHeader>
                        <b>Incident Details</b>
                    </CardHeader>
                    <CardBody>
                        <table className="table table-bordered table-sm mb-0">
                            <tbody>
                                <tr>
                                    <th>Date of Incident</th>
                                    <td>{incident_details.incident_date}</td>
                                </tr>
                                <tr>
                                    <th>Nature of Incident</th>
                                    <td>{incident_details.incident_nature}</td>
                                </tr>
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
              </Col>
              <Col xs="12" md="6">
                  <Card>
                    <CardHeader>
                        <b>Personal Details</b>
                    </CardHeader>
                    <CardBody>
                        <table className="table table-bordered table-sm mb-0">
                            <tbody>
                                <tr>
                                    <th>Full Name</th>
                                    <td>{personal_details.full_name}</td>
                                </tr>
                                <tr>
                                    <th>E-mail address</th>
                                    <td>{personal_details.email}</td>
                                </tr>
                                <tr>
                                    <th>Date of Birth</th>
                                    <td>{personal_details.dob}</td>
                                </tr>
                                <tr>
                                    <th>Govt. Identification No.</th>
                                    <td>{personal_details.gin}</td>
                                </tr>
                                <tr>
                                    <th>Alternate Phone Number</th>
                                    <td>{personal_details.number}</td>
                                </tr>
                                <tr>
                                    <th>Address</th>
                                    <td>{personal_details.address}</td>
                                </tr>
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
              </Col>
          </Row>
          <Row>
              <Col xs="12">
                  <Card>
                    <CardHeader>
                        <b>Comments</b>
                    </CardHeader>
                    <CardBody className="p0">
                        {comments.length > 0 ? <article className="bglite">
                            {comments.map((comment, index) => (
                                <div className="comment-item" key={index}>
                                    <h6>{comment.username} :</h6>
                                    <div className="commentbox">
                                      <p className="comment-txt">{comment.comment}</p>
                                      <p className="comment-date"><span>{comment.comment_date}</span></p>
                                    </div>
                                </div>
                            ))}
                        </article> : (<p className="nodata"> No comments found</p>)
                        }
                    </CardBody>
                </Card>
              </Col>
          </Row>
        </div>
    }

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
                        : view_case
                }
                </ul>
            </div>
          )
        }
        </I18n>
    )
  }
}

export default translate('translations')(View);
