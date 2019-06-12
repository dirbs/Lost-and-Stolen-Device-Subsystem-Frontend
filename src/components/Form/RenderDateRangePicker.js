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
import { DateRangePicker } from "react-dates";
import {Date_Format} from './../../utilities/constants';
import i18n from './../../i18n';

/**
 * A Stateful component used to Create a Date Range Picker
 */
export default class RenderDateRangePicker extends Component {
  constructor(props) {
      super(props);

      this.state = {
          startDate: null,
          initialDate: moment('06-01-2016', Date_Format),
          endDate: null
      };

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.onDatesChange = this.onDatesChange.bind(this);
    this.isOutsideRange = this.isOutsideRange.bind(this);
    this.resetDate = this.resetDate.bind(this);
  }

  resetDate(){
    this.setState({
      startDate: null,
      initialDate: moment('06-01-2016', Date_Format),
      endDate: null
    })
  }

  isOutsideRange(day) {
      return false;
  }

  onDatesChange(dateObj1) {
      if(dateObj1.startDate) {
          this.setState({startDate: dateObj1.startDate})
      }
      if(dateObj1.endDate) {
          this.setState({endDate: dateObj1.endDate})
      }
      if(dateObj1.startDate === null && dateObj1.endDate === null) {
          this.setState({startDate: null})
          this.setState({endDate: null})
          this.handleBlur();
          this.handleChange(dateObj1);
      }
      this.handleBlur();
      this.handleChange(dateObj1);
  }

  handleChange(dateObj) {
    const {startDate, endDate } = dateObj;
    // this is going to call setFieldValue and manually update values.fieldName
    if(startDate && endDate) {
        this.props.onChange(this.props.name, startDate.format(Date_Format) + ',' +endDate.format(Date_Format));
    } else {
        this.props.onChange(this.props.name, '');
    }
  }

  handleBlur() {
    this.props.onBlur(this.props.name, true);
  }


  render() {
    return (
      <DateRangePicker
        numberOfMonths={2}
        minimumNights={0}
        isOutsideRange={this.isOutsideRange}
        startDate={this.state.startDate} // momentPropTypes.momentObj or null,
        startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
        endDate={this.state.endDate} // momentPropTypes.momentObj or null,
        endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
        onDatesChange={this.onDatesChange}
        focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
        onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
        small
        displayFormat={Date_Format}
        showClearDates
        reopenPickerOnClearDates
        readOnly
        orientation={window.matchMedia("(max-width: 575px)").matches?"vertical":"horizontal"}
        daySize={28}
        startDatePlaceholderText={i18n.t('dateRangePicker.startDate')}
        endDatePlaceholderText={i18n.t('dateRangePicker.endDate')}
        hideKeyboardShortcutsPanel
      />
    );
  }
}
