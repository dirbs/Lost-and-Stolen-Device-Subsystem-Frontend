/*
SPDX-License-Identifier: BSD-4-Clause-Clear

Copyright (c) 2018 Qualcomm Technologies, Inc.

All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted (subject to the limitations in the disclaimer
below) provided that the following conditions are met:

*         Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.

*         Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.

*         All advertising materials mentioning features or use of this
software, or any deployment of this software, or documentation accompanying
any distribution of this software, must display the trademark/logo as per
the details provided here:
https://www.qualcomm.com/documents/dirbs-logo-and-brand-guidelines

*         Neither the name of Qualcomm Technologies, Inc. nor the names of
its contributors may be used to endorse or promote products derived from
this software without specific prior written permission.

 

SPDX-License-Identifier: ZLIB-ACKNOWLEDGEMENT

Copyright (c) 2018 Qualcomm Technologies, Inc.

This software is provided 'as-is', without any express or implied warranty.
In no event will the authors be held liable for any damages arising from the
use of this software.

Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:

*         The origin of this software must not be misrepresented; you must
not claim that you wrote the original software. If you use this software in
a product, an acknowledgment is required by displaying the trademark/logo as
per the details provided here:
https://www.qualcomm.com/documents/dirbs-logo-and-brand-guidelines

*         Altered source versions must be plainly marked as such, and must
not be misrepresented as being the original software.

*         This notice may not be removed or altered from any source
distribution.

NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY
THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT
NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React from "react";
import NewCase from './NewCase';
import {mount, shallow, render, ReactWrapper} from 'enzyme';
import { findDOMNode } from 'react-dom';
import {I18nextProvider} from "react-i18next";
import i18n from "./../../i18nTest";
import sinon from 'sinon';
import mockAxios from 'jest-mock-axios';
import {BrowserRouter as Router} from 'react-router-dom';

const mockKcProps = {
  'isTokenExpired': sinon.spy()
}

const mockHeader = {
  "headers": {
    "Authorization": "Bearer null",
    "Content-Type": "application/json"
  }
}

describe('NewCase component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // values stored in tests will also be available in other tests unless you run
    localStorage.clear();
    localStorage.userInfo = 'eyJzdWIiOiI5YTQ0MDNjMi01YTQ4LTRiNzktOWYzMC0wMmMwY2M3Nzk5ZTAiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJxdWFsY29tbSJ9';
  });
  afterEach(() => {
    // fast forward time for modal to fade out
    jest.runTimersToTime(1);
    jest.clearAllTimers();
    mockAxios.reset();
  });
  test("if renders correctly", () => {
    const wrapper = shallow(<NewCase />);
    expect(wrapper).toMatchSnapshot()
  });
  test("if mounted then shows initial form inputs", () => {
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <NewCase kc={mockKcProps}/>
        </I18nextProvider>
      </Router>
    );
    expect(wrapper.find('Card')).toHaveLength(1);
    expect(wrapper.find('input')).toHaveLength(2);
    expect(wrapper.find('textarea')).toHaveLength(1);
    expect(wrapper.find('Modal')).toHaveLength(4);
    expect(wrapper.find('button')).toHaveLength(1);
  });

  test("when values are entered show more form inputs", () => {
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <NewCase kc={mockKcProps}/>
        </I18nextProvider>
      </Router>
    );
    const brandEvent = {
      target: {
        value: 'test-brand',
        name: 'brand'
      }
    };
    wrapper.find('input').at(0).simulate('change', brandEvent);
    const modalEvent = {
      target: {
        value: 'test-modal',
        name: 'model_name'
      }
    };
    wrapper.find('input').at(1).simulate('change', modalEvent);
    const descEvent = {
      target: {
        value: 'test-physical-description',
        name: 'physical_description'
      }
    };
    wrapper.find('textarea').at(0).simulate('change', descEvent);
    wrapper.update();
    expect(wrapper.find('Card').length).toEqual(2);
    expect(wrapper.find('.radio-wrap').exists()).toBe(true);
    expect(wrapper.find('.radio-wrap input').length).toEqual(2);

    const knownCheckEvent = {
      target: {
        value: 'yes',
        name: 'imei_known'
      }
    };
    wrapper.find('.radio-wrap input').at(0).simulate('change', knownCheckEvent);
    wrapper.update();
    expect(wrapper.find('Card').length).toEqual(5);
    const MSISDNButton = wrapper.find('button').at(0);
    MSISDNButton.simulate('click');
    expect(wrapper.find('CaseForm').state().showModal).toBe(true);
    expect(wrapper.find('CaseForm').state().showModalTitle).toBe('Add an MSISDN');
    const msisdnEvent = {
      target: {
        value: '123456789123456',
        name: 'msisdnInput'
      }
    };
    wrapper.find('RenderModal').find('input').at(0).simulate('change', msisdnEvent);
    const reTypeMsisdnEvent = {
      target: {
        value: '123456789123456',
        name: 'retypeMsisdnInput'
      }
    };
    wrapper.find('RenderModal').find('input').at(1).simulate('change', reTypeMsisdnEvent);
    const saveBtn = wrapper.find('RenderModal').find('ModalFooter').find('button').at(0);
    // Save entered MSISDNs and Close Modal
    saveBtn.simulate('click');
    const imeiButton = wrapper.find('button').at(3);
    imeiButton.simulate('click');
    //console.log(wrapper.find('RenderModal').debug());
    expect(wrapper.find('CaseForm').state().imeiModal).toBe(true);
    expect(wrapper.find('CaseForm').state().imeiModalTitle).toBe('Add an IMEI');
    const imeiEvent = {
      target: {
        value: '1111111111111111',
        name: 'imeiInput'
      }
    };
    wrapper.find('RenderModal').find('input').at(0).simulate('change', imeiEvent);
    const reTypeImeiEvent = {
      target: {
        value: '1111111111111111',
        name: 'retypeImeiInput'
      }
    };
    wrapper.find('RenderModal').find('input').at(1).simulate('change', reTypeImeiEvent);
    //console.log(wrapper.find('RenderModal').at(1).find('ModalFooter').find('button').debug());
    const imeiSaveBtn = wrapper.find('RenderModal').at(1).find('ModalFooter').find('button').at(0);
    // Save entered IMEI and Close Modal
    imeiSaveBtn.simulate('click');
    expect(wrapper.find('CaseForm').state().imeiModal).toBe(false);

    const inputtedData = {
      incident_date: {
        target: {
          value: '1990-01-01',
          name: 'incident_date'
        }
      },
      incident: {
        target: {
          value: '1',
          name: 'incident'
        }
      },
      full_name: {
        target: {
          value: 'test-name',
          name: 'full_name'
        }
      },
      dob: {
        target: {
          value: '1990-01-01',
          name: 'dob'
        }
      },
      gin: {
        target: {
          value: '12345678912345',
          name: 'gin'
        }
      },
      address: {
        target: {
          value: 'test-address',
          name: 'address'
        }
      },
      alternate_number: {
        target: {
          value: '03001234567',
          name: 'alternate_number'
        }
      },
      email: {
        target: {
          value: 'test@example.com',
          name: 'email'
        }
      }
    };
    // Find the 5th box and input values of Incident Details
    wrapper.find('Card').at(5).find('input').at(0).simulate('change', inputtedData.incident_date);
    wrapper.find('Card').at(5).find('select').at(0).simulate('change', inputtedData.incident);
    // Find the 6th box and input values of Personal Details
    wrapper.find('Card').at(7).find('input').at(0).simulate('change', inputtedData.full_name);
    wrapper.find('Card').at(7).find('input').at(1).simulate('change', inputtedData.dob);
    wrapper.find('Card').at(7).find('input').at(2).simulate('change', inputtedData.gin);
    wrapper.find('Card').at(7).find('input').at(3).simulate('change', inputtedData.alternate_number);
    wrapper.find('Card').at(7).find('input').at(4).simulate('change', inputtedData.email);
    wrapper.find('Card').at(7).find('input').at(5).simulate('change', inputtedData.address);

    const submittedCase = {
      "case_details": {
        "get_blocked": true,
      },
      loggedin_user: {
        user_id : '9a4403c2-5a48-4b79-9f30-02c0cc7799e0',
        username : 'qualcomm'
      },
      case_status: 1,
      incident_details: {
        incident_date: "1990-01-01",
        incident_nature: "1",
      },
      personal_details: {
        full_name: "test-name",
        dob: "1990-01-01",
        address: "test-address",
        gin: "12345678912345",
        number: "03001234567",
        email: "test@example.com"
      },
      device_details: {
        brand: "test-brand",
        model_name: "test-modal",
        description: "test-physical-description",
        imeis: ["1111111111111111"],
        msisdns: ["123456789123456"]
      }
    }
    const newCaseResponse = {
      data: {"tracking_id": "IUJ34ET5", "message": "case successfully added"}
    }
    wrapper.update();
    const submitButton = wrapper.find('button').at(14);
    submitButton.simulate('submit');
    // expect(mockAxios.post).toHaveBeenCalledWith('/case', submittedCase, mockHeader);
    // mockAxios.mockResponse(newCaseResponse)
    // wrapper.update()
    // expect(wrapper.find('NewCase').state().caseSubmitted).toBe(true);
    // expect(wrapper.find('NewCase').state().loading).toBe(false);
  });
});