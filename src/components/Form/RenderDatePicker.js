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

import React, {Component} from "react";
import moment from "moment";
import { SingleDatePicker } from "react-dates";
import {range} from './../../utilities/helpers';
import {Date_Format} from './../../utilities/constants';
const minRange = 0;
const maxRange = 119;
/**
 * A Stateful component used to Create a Single Date Picker
 */
export default class RenderDateRangePicker extends Component {
  constructor(props) {
      super(props);

      this.state = {
          date: this.props.curDate ? moment(this.props.curDate, Date_Format): null,
          focused: false
      };

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.isOutsideRange = this.isOutsideRange.bind(this);
    this.resetDate = this.resetDate.bind(this);
  }

  resetDate(){
    this.setState({
      date: null
    })
  }

  isOutsideRange(day) {
      const nextBtn = document.getElementsByClassName('DayPickerNavigation_button')[1];
      if(day.year() > maxRange + 1900 && nextBtn != null ) {
             nextBtn.style.display = 'none';
        }
        else if( nextBtn != null ){
          nextBtn.style.display = 'block';
      }

      return false;
  }
  onDateChange(date) {
      if(date) {
          this.setState({date: date})
          this.handleBlur();
          this.handleChange(date);
      } else {
          this.setState({date: null})
          this.handleBlur();
          this.handleChange(null);
      }
  }

  handleChange(date) {
    // this is going to call setFieldValue and manually update values.fieldname
    if(date) {
        this.props.onChange(this.props.name, date.format(Date_Format));
    } else {
        this.props.onChange(this.props.name, '');
    }
  }

  handleBlur() {
    this.props.onBlur(this.props.name, true);
  }


  render() {
    return (
      <SingleDatePicker
        numberOfMonths={1}
        isOutsideRange={this.isOutsideRange}
        onDateChange={this.onDateChange}
        onFocusChange={({ focused }) => this.setState({ focused})}
        focused={this.state.focused}
        date={this.state.date}
        block
        showClearDate
        displayFormat={Date_Format}
        reopenPickerOnClearDate
        readOnly
        hideKeyboardShortcutsPanel
        placeholder={Date_Format}
        renderMonthElement={({ month, onMonthSelect, onYearSelect }) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div>
            <select
              value={month.month()}
              onChange={(e) => { onMonthSelect(month, e.target.value); }}
            >
              {moment.months().map((label, value) => (
                <option value={value} key={label}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={month.year()}
              onChange={(e) => { onYearSelect(month, e.target.value); }}
            >
              {range(minRange, maxRange).map((no, i) => (
                  <option key={no} value={moment().year() - no}>{moment().year() - no}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      />
    );
  }
}
