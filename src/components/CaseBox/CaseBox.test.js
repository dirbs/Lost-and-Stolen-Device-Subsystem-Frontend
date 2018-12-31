import React from 'react';
import {mount, shallow} from 'enzyme';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import CaseBox from './CaseBox';

// const status = 'Pending';
const msisdn = [234234, 234234];
const infoProps = {
    status: 'Pending',
    tracking_id: 234234,
    incident_details: {
        incident_nature: 'Lost',
        incident_date: '2010-10-10'
    },
    creator: {
        username: 'test',
    },
    device_details: {
        msisdns: msisdn
    },
    personal_details: {
        full_name: 'test name',
        model_name: 'test model'
    },
    updated_at: '2010-10-10'
}

describe('CaseBox Component', ()=> {
  test('If CaseBox renders',()=>{
    const wrapper = shallow(<CaseBox info={infoProps}/>);
    expect(wrapper.exists()).toBe(true);
  })

  test('contains a specific class upon status value i.e. Pending, Blocked, Recovered',()=>{
    const wrapper = shallow(<CaseBox info={infoProps}/>);
    expect(wrapper.find('li').first().hasClass('case-pending')).toBe(true);
  })

  test('if Status is pending then we have 2 action buttons',()=>{
    infoProps.status = 'Pending';
    const wrapper = shallow(<CaseBox info={infoProps}/>);
    expect(wrapper.find('Button')).toHaveLength(2);
  })

  test('if Status is Blocked then we have only 1 action button',()=>{
    infoProps.status = 'Blocked';
    const wrapper = shallow(<CaseBox info={infoProps}/>);
    expect(wrapper.find('Button')).toHaveLength(1);
  })

  test('if Recover button clicking works',()=>{
    infoProps.status = 'Blocked';
    const mockCallBack = jest.fn();
    const wrapper = mount(
      <Router>
        <CaseBox info={infoProps} handleCaseStatus={mockCallBack}/>
      </Router>);
    const recoverBtn = wrapper.find('Button');
    recoverBtn.simulate('click');
    expect(mockCallBack.mock.calls.length).toEqual(1);
  })

  test('if Recover and Block buttons clicking works',()=>{
    infoProps.status = 'Pending';
    const mockCallBack = jest.fn();
    const wrapper = mount(
      <Router>
        <CaseBox info={infoProps} handleCaseStatus={mockCallBack}/>
      </Router>);
    const recoverBtn = wrapper.find('Button').at(0);
    recoverBtn.simulate('click');
    expect(mockCallBack.mock.calls.length).toEqual(1);
    // Reset mock for button
    mockCallBack.mockReset();
    const blockBtn = wrapper.find('Button').at(1);
    blockBtn.simulate('click');
    expect(mockCallBack.mock.calls.length).toEqual(1);
  })

  test('incident-status container contains spans',()=>{
    const mockCallBack = jest.fn();
    const wrapper = mount(
      <Router>
        <CaseBox info={infoProps} handleCaseStatus={mockCallBack}/>
      </Router>);
    expect(wrapper.find('.incident-status').find('span').length).toEqual(5);
  });

  test('more-detail container contains li',()=>{
    const mockCallBack = jest.fn();
    const wrapper = mount(
      <Router>
        <CaseBox info={infoProps} handleCaseStatus={mockCallBack}/>
      </Router>);
    expect(wrapper.find('.more-detail').find('li').length).toEqual(4);
  })
});