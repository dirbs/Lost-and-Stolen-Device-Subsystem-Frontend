/*
Copyright (c) 2018 Qualcomm Technologies, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the disclaimer below) provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import axios from 'axios';
import { toast } from 'react-toastify';
import Base64 from 'base-64';
import settings from './../settings';

/**
 * Create API, Keycloak and Tyk URLs based on settings.json file
 */
const {host: apiHost, port: apiPort, version: apiVersion, use: apiUse} = settings.api;
const {host: apimanHost, port: apimanPort, clientId: apimanClientId, use: apimanUse} = settings.apiman;
const {appName} = settings.appDetails;

let BASE_URL = '';

if(apiUse) {
 BASE_URL = `${apiHost}${apiPort ? ':'+ apiPort: ''}${apiVersion}`;
} else if(apimanUse) {
 BASE_URL = `${apimanHost}${apimanPort ? ':'+ apimanPort: ''}${apimanClientId}`;
}

/**
 * generate axios instance for calling http requests with common URL.
 *
 * @type {AxiosInstance}
 */
export const instance = axios.create({
    baseURL: BASE_URL, // QA Build
});

/**
 * This function return an header for http request with Keycloak token
 *
 * @returns {{Authorization: string, "Content-Type": string}}
 */
export function getAuthHeader (token) {
  let accessToken = localStorage.getItem('token');
  if(token) {
    accessToken = token;
  }
  return {
    'Authorization': 'Bearer ' + accessToken,
    'Content-Type': 'application/json'
  }
}

export function range(start, limit, step) {

  if (arguments.length === 1) {
    limit = start;
    start = 0;
  }

  limit = limit || 0;
  step = step || 1;

  for (var result = []; (limit - start) * step > 0; start += step) {
    result.push(start);
  }
  return result;
}

/**
 * This function return the encode user info stored in local storage from Keycloak
 *
 * @returns {any}
 */
export function getUserInfo () {
  return JSON.parse(Base64.decode(localStorage.getItem('userInfo')))
}

/**
 * this function get all groups of currently loggedIn user
 *
 * @param resources
 * @returns {string}
 */
export function getUserGroups (resources) {
  let groups = '';
  let groupDetails = (((resources || {}).realm_access || {}).roles || []);
  // Remove default group first
  let index = groupDetails.indexOf('uma_authorization');
  if (index !== -1)
      groupDetails.splice(index, 1);
  if(groupDetails.length > 0) {
    groups = groupDetails;
  }
  return groups;
}

/**
 * This functions get users' groups assigned by Keycloak and see if user has access to this application
 *
 * @param groups
 * @returns {boolean}
 */
export function isPage401(groups) {
  let pageStatus = false; // assume it's not page401
  pageStatus = (groups.length > 0) ? false : true; // if groups exist then that's not page401
  if (! pageStatus) { // if groups exist then we apply another check
    pageStatus = groups.find(app => app.split('_')[0] === appName) ? false : true; // app name is same as role assigned
  }
  return pageStatus;
}

/**
 * Generic Errors handling for Axios
 *
 * @param context
 * @param error
 */
export function errors (context, error) {
  if(typeof error !== 'undefined'){
    if(typeof error.response === 'undefined') {
      //toast.error('API Server is not responding or You are having some network issues');
    } else {
      if(error.response.status === 400) {
        toast.error(error.response.data.message);
      } else if(error.response.status === 401) {
        toast.error('Your session has been expired, please wait');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else if(error.response.status === 403) {
        toast.error('These credential do not match our records.');
      } else if(error.response.status === 404) {
        toast.error(error.response.data.message);
      } else if(error.response.status === 405) {
        toast.error('You have used a wrong HTTP verb');
      } else if(error.response.status === 406) {
        toast.error(error.response.data.message);
      } else if(error.response.status === 409) {
        toast.error(error.response.data.message, { autoClose: 10000 });
      } else if(error.response.status === 422) {
        let errors = error.response.data.messages;
        for (var key in errors) {
           var caseErrors = errors[key];
           for(var i in caseErrors) {
              toast.error(caseErrors[i][0], { autoClose: 10000 });
           }
        }
      } else if(error.response.status >= 500) {
        toast.error("API Server is not responding or You are having some network issues", { autoClose: 8000 });
      }
    }
  }
}
