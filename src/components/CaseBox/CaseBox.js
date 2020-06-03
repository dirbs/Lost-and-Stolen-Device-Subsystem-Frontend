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

import React from 'react';
import { Button } from 'reactstrap';
import { Link } from "react-router-dom";
import { BLOCKED_CASE, RECOVERED_CASE } from "../../utilities/constants";
import i18n from './../../i18n';

/**
 * This component accepts some props and display Case details, such case status, case identifier, etc.
 *
 * @param props
 * @returns an html list item
 * @constructor
 */
const CaseBox = (props) => {
    const borderClass =
        (props.info.status === i18n.t('caseStatus.pending'))
            ?
            'casebox case-pending'
            : (props.info.status === "Recovered")
                ? 'casebox case-recovered'
                : 'casebox case-blocked';

    return (
        <>
            {props.info.source === "CPLC" ?
                <li className={borderClass}>
                    <div className="case-head">
                        <div className="case-actions">
                            {(props.info.status === i18n.t('caseStatus.pending')) ?
                                <div>
                                    <p>
                                        {(props.creator.user_id === props.userDetails.sub || props.userDetails.role === 'admin') && <Link className="btn-sm btn btn-primary" to={`/case-update/${props.info.tracking_id}`}>{i18n.t('button.update')}</Link>}
                                        {props.userDetails && props.userDetails.role === 'staff' ? null : <React.Fragment>
                                            <Button color="success" size="sm" onClick={(e) => props.handleCaseStatus(e, props.info.tracking_id, RECOVERED_CASE)}>{i18n.t('button.recover')}</Button>{''}
                                            {props.info.get_blocked === true ?
                                                <Button color="danger" size="sm" onClick={(e) => props.handleCaseStatus(e, props.info.tracking_id, BLOCKED_CASE)}>{i18n.t('button.block')}</Button>
                                                : null}
                                        </React.Fragment>}
                                    </p>
                                </div>
                                : null
                            }

                            {(props.info.status === i18n.t('caseStatus.blocked')) && (props.userDetails && props.userDetails.role !== 'staff') ?
                                <p>
                                    <Button color="success" size="sm" onClick={(e) => props.handleCaseStatus(e, props.info.tracking_id, RECOVERED_CASE)}>{i18n.t('button.recover')}</Button>{' '}
                                </p>
                                : null
                            }
                        </div>
                        <div className="case-content">
                            <h2 className="case-title">
                                {i18n.t('caseBox.caseIdentifier')}: {props.info.tracking_id}
                            </h2>
                            <p className="incident-status">
                                <span className="status">{i18n.t('caseBox.status')} <b>{i18n.t(props.info.status)}</b></span>
                            </p>
                        </div>
                    </div>
                    <div className="case-footer">
                        <ul className="more-detail">
                            <li>
                                <p>{i18n.t('caseBox.affectedMSISDNs')}<span>{props.info.device_details.msisdns.join(', ')}</span></p>
                            </li>
                            <li>
                                <p>Affected IMEIs<span>{props.info.device_details.imeis.join(', ')}</span></p>
                            </li>
                            <li>
                                <p>Source<span>CPLC</span></p>
                            </li>
                            <li>
                                <p>{i18n.t('caseBox.lastUpdated')}<span>{props.info.updated_at}</span></p>
                            </li>
                        </ul>
                    </div>
                </li> :
                <li className={borderClass}>
                    <div className="case-head">
                        <div className="case-actions">
                            {(props.info.status === i18n.t('caseStatus.pending')) ?
                                <div>
                                    <p>
                                        {(props.creator.user_id === props.userDetails.sub || props.userDetails.role === 'admin') && <Link className="btn-sm btn btn-primary" to={`/case-update/${props.info.tracking_id}`}>{i18n.t('button.update')}</Link>}
                                        {props.userDetails && props.userDetails.role === 'staff' ? null : <React.Fragment>
                                            <Button color="success" size="sm" onClick={(e) => props.handleCaseStatus(e, props.info.tracking_id, RECOVERED_CASE)}>{i18n.t('button.recover')}</Button>{''}
                                            {props.info.get_blocked === true ?
                                                <Button color="danger" size="sm" onClick={(e) => props.handleCaseStatus(e, props.info.tracking_id, BLOCKED_CASE)}>{i18n.t('button.block')}</Button>
                                                : null}
                                        </React.Fragment>}
                                    </p>
                                </div>
                                : null
                            }

                            {(props.info.status === i18n.t('caseStatus.blocked')) && (props.userDetails && props.userDetails.role !== 'staff') ?
                                <p>
                                    <Button color="success" size="sm" onClick={(e) => props.handleCaseStatus(e, props.info.tracking_id, RECOVERED_CASE)}>{i18n.t('button.recover')}</Button>{' '}
                                </p>
                                : null
                            }
                        </div>
                        <div className="case-content">
                            <h2 className="case-title">
                                <Link to={`/case/${props.info.tracking_id}`}>{i18n.t('caseBox.caseIdentifier')}: {props.info.tracking_id}</Link>
                            </h2>
                            <p className="incident-status">
                                <span className="incident"><b>{i18n.t(props.info.incident_details.incident_nature)}</b> {i18n.t('at')} {props.info.incident_details.incident_date}</span>
                                <span className="dot-sep"></span>
                                <span className="status">{i18n.t('caseBox.status')} <b>{i18n.t(props.info.status)}</b></span>
                                <span className="dot-sep"></span>
                                <span className="creater">{i18n.t('caseBox.creator')} <b>{props.info.creator.username}</b></span>
                            </p>
                        </div>
                    </div>
                    <div className="case-footer">
                        <ul className="more-detail">
                            <li>
                                <p>{i18n.t('caseBox.affectedMSISDNs')}<span>{props.info.device_details.msisdns.join(', ')}</span></p>
                            </li>
                            <li>
                                <p>{i18n.t('caseBox.affectedUser')}<span>{props.info.personal_details.full_name}</span></p>
                            </li>
                            <li>
                                <p>{i18n.t('caseBox.modelName')}<span>{props.info.device_details.model_name}</span></p>
                            </li>
                            <li>
                                <p>{i18n.t('caseBox.lastUpdated')}<span>{props.info.updated_at}</span></p>
                            </li>
                        </ul>
                    </div>
                </li>
            }
        </>
    )
}


export default CaseBox;
