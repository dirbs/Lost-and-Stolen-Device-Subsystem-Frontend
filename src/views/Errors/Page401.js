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
import Header from '../../components/Header/';
import Footer from '../../components/Footer/';
import { I18n, translate } from 'react-i18next';
import settings from './../../settings';

/**
 * This Stateful component generates 401 page for unauthorized user. i.e. Keycloak user who doesn't have access to this system.
 * Also it provides user with contact details.
 */
class Page401 extends Component {
    constructor(props) {
        super(props);
        this.changeLanguage = this.changeLanguage.bind(this);
    }
    changeLanguage(lng) {
        const { i18n } = this.props;
        i18n.changeLanguage(lng);
    }

    componentDidMount() {
        document.body.classList.remove('sidebar-fixed');
        document.body.classList.remove('aside-menu-fixed');
        document.body.classList.remove('aside-menu-hidden');
        this.props.history.push('/unauthorized-access');
    }
    render() {
        const {supportEmail, supportNumber} = settings.appDetails;
        return (
            <I18n ns="translations">
            {
                (t, { i18n }) => (
                    <div className="app header-fixed">
                        <Header {...this.props} switchLanguage={this.changeLanguage} />
                        <div className="app-body">
                            <main className="main p401">
                                <div className="container-fluid">
                                    <div className="text-center">
                                        <h1><b>401</b></h1>
                                        <h2>Unauthorized Page</h2>
                                        <h6><b>Contact Administrator</b></h6>
                                        <div className="inline-support">
                                            <ul>
                                                <li><b>Email:&nbsp;&nbsp;</b>{supportEmail}</li>
                                            </ul>
                                            <ul>
                                                <li><b>Phone:&nbsp;&nbsp;</b>{supportNumber}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
                        <Footer />
                    </div>
                )
            }
            </I18n>
        )
    }
}

export default translate('translations')(Page401);