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

import React, {Component} from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';

// Containers
import Full from './containers/Full/';

import {getUserGroups, isPage401} from "./utilities/helpers";
import Keycloak from 'keycloak-js';
import decode from 'jwt-decode';
import Base64 from 'base-64';
import Page401 from "./views/Errors/Page401";
import ReactDOM from "react-dom";
import RenderWarningPopup from "./components/Form/RenderWarningPopup";
import i18n from './i18n';

import settings from './settings.json'
import {KC_URL} from './utilities/constants';

const { clientId, realm } = settings.keycloak;

class Auth extends Component {

	constructor(props) {
		super(props);
		this.state = {
			keycloak: null,
			authenticated: false,
			readyToRedirect: false,
			redirectToFull : false,
			userDetails: null,
			tokenDetails: null,
			userRole: ""
		};
	}

	componentDidMount() {
		const keycloak = Keycloak({
			url:KC_URL,
			realm:realm,
			clientId:clientId
		});
		keycloak.init({onLoad: 'login-required', 'checkLoginIframe' : false}).success(authenticated => {
			if(authenticated){
				this.setState({keycloak: keycloak, authenticated: authenticated})
				//Set token in local storage
				localStorage.setItem('token', keycloak.token);

				const tokenDetails = decode(keycloak.token)
				const groups = getUserGroups(tokenDetails);
				this.setState({ userRole: groups.includes("admin") ? "admin" : groups.includes("staff") ? "staff" : null });
				const pageStatus = isPage401(groups);
				if (pageStatus) { // is Page401 then show page401
					keycloak.loadUserInfo().success((userInfo) => {
						this.setState({
							redirectTo404: true,
							userDetails: userInfo,
							keycloak: keycloak
						},()=>{
							this.setState({
								readyToRedirect: true
							})
						})
					});
				} else { // User has permission and therefore, allowed to access it.
					keycloak.loadUserInfo().success( (userInfo) => {
						localStorage.setItem('userInfo', Base64.encode(JSON.stringify(userInfo)));
						let userInfoWithRole = {
							...userInfo,
							role: this.state.userRole
						}
						this.setState({
							redirectToFull : true,
							userDetails: userInfoWithRole,
							keycloak: keycloak,
							tokenDetails:tokenDetails
						},()=>{
							this.setState({
								readyToRedirect: true
							})
						})
					});
				}
			} else {
				keycloak.login();
			}
		})
	}

	render() {
		if (this.state.keycloak) {
			if (this.state.authenticated){
				if(this.state.redirectTo404 && this.state.readyToRedirect){
					return (
						<HashRouter>
							<Switch>
								<Route path="/" render={(props) => <Page401
									kc={this.state.keycloak}
									userDetails={this.state.userDetails}
									{...props} /> } />
							</Switch>
						</HashRouter>
					);
				} else if(this.state.redirectToFull && this.state.readyToRedirect){
					return (
						<HashRouter getUserConfirmation={(message, callback) => {
                            ReactDOM.render((
                                <RenderWarningPopup component={RenderWarningPopup} message={message} callback={callback} />
                            ), document.getElementById('modal'))
                        }}>
							<Switch>
								<Route path="/" render={(props) => <Full
									kc={this.state.keycloak}
									userDetails={this.state.userDetails}
									{...props} /> } />
							</Switch>
						</HashRouter>
					);
				}
			}
		}
		return (
			<div className="page-loader">
				<div className="loading" data-app-name={i18n.t('title')}>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>
		);
	}

}

export default Auth