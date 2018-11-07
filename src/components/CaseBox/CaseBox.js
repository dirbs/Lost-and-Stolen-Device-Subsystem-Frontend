/*
Copyright (c) 2018 Qualcomm Technologies, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the disclaimer below) provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React from 'react';
import {Button} from 'reactstrap';
import { Link } from "react-router-dom";
import {BLOCKED_CASE, RECOVERED_CASE} from "../../utilities/constants";

/**
 * This component accepts some props and display Case details, such case status, case identifier, etc.
 *
 * @param props
 * @returns an html list item
 * @constructor
 */
const CaseBox = (props) => {
    const borderClass =
        (props.info.status === 'Pending')
        ?
            'casebox case-pending'
        : (props.info.status === 'Recovered')
            ? 'casebox case-recovered'
            : 'casebox case-blocked';

    return (
        <li className={borderClass}>
            <div className="case-head">
                <div className="case-actions">
                    {(props.info.status === 'Pending') ?
                        <div>
                            <p>
                                <Link className="btn-sm btn btn-primary" to={`/case-update/${ props.info.tracking_id }`}>Update</Link>
                                <Button color="success" size="sm" onClick={(e) => props.handleCaseStatus(e, props.info.tracking_id, RECOVERED_CASE)}>Recover</Button>{''}
                                <Button color="danger" size="sm" onClick={(e) => props.handleCaseStatus(e, props.info.tracking_id, BLOCKED_CASE)}>Block</Button>
                            </p>
                        </div>
                        : null
                    }

                    {(props.info.status === 'Blocked') ?
                        <p>
                            <Button color="success" size="sm" onClick={(e) => props.handleCaseStatus(e, props.info.tracking_id, RECOVERED_CASE)}>Recover</Button>{' '}
                        </p>
                        : null
                    }
                </div>
                <div className="case-content">
                    <h2 className="case-title">
                         <Link to={`/case/${ props.info.tracking_id }`}>Case Identifier: {props.info.tracking_id}</Link>
                    </h2>
                    <p className="incident-status">
                        <span className="incident"><b>{props.info.incident_details.incident_nature}</b> at {props.info.incident_details.incident_date}</span>
                        <span className="dot-sep"></span>
                        <span className="status">Status <b>{props.info.status}</b></span>
                        <span className="dot-sep"></span>
                        <span className="creater">Creator <b>{props.info.creator.username}</b></span>
                    </p>
                </div>
            </div>
            <div className="case-footer">
                <ul className="more-detail">
                    <li>
                        <p>Affected MSISDNs<span>{props.info.device_details.msisdns.join(', ')}</span></p>
                    </li>
                    <li>
                        <p>Affected User<span>{props.info.personal_details.full_name}</span></p>
                    </li>
                    <li>
                        <p>Model Name<span>{props.info.device_details.model_name}</span></p>
                    </li>
                    <li>
                        <p>Last Updated<span>{props.info.updated_at}</span></p>
                    </li>
                </ul>
            </div>
        </li>
    )
}


export default CaseBox;
