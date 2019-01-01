import React from 'react';
import {shallow, mount, render} from 'enzyme';
import View from './View';
import {I18nextProvider} from "react-i18next";
import i18n from "./../../../i18nTest"
import sinon from 'sinon'
import mockAxios from 'jest-mock-axios';
import {BrowserRouter as Router} from 'react-router-dom';

const mockKcProps = {
  'isTokenExpired': sinon.spy()
}

const match = { params: { tracking_id: 'IUJ34ET5' } }

const mockHeader = {
  "headers": {
    "Authorization": "Bearer null",
    "Content-Type": "application/json"
  }
}

let responseObj = {
  data: {
        comments: [{
          comment: "Testing comment",
          comment_date: "2018-10-29T10:58:31.189731",
          user_id: "9a4403c2-5a48-4b79-9f30-02c0cc7799e0",
          username: "test"
        }],
        creator: {
          username: 'test',
          user_id: '9a4403c2-5a48-4b79-9f30-02c0cc7799e0'
        },
        device_details: {
          imeis: ['123456787655345'],
          description: 'test description',
          brand: 'test brand',
          model_name: 'test model',
          msisdns: ['03231234567']
        },
        incident_details: {
          incident_date: '2018-01-01',
          incident_nature: 'Test'
        },
        personal_details: {
          full_name: 'test',
          email: 'test@example.com',
          dob: null,
          gin: null,
          address: 'test address',
          number: null
        },
        status: 'Recovered',
        tracking_id: 'IUJ34ET5',
        updated_at: '2018-01-01 10:10:10',
        created_at: '2018-10-29 10:34:34'
      }
}

afterEach(() => {
  // cleaning up the mess left behind the previous test
  mockAxios.reset();
});

describe('View component', () => {
  test("if renders correctly", () => {
    const wrapper = shallow(<View match={match}/>);
    expect(wrapper).toMatchSnapshot()
  });
  test('If View Cases renders',()=>{
    const wrapper = shallow(<View match={match}/>);
    expect(wrapper.exists()).toBe(true);
  })
  test('View Cases if renders no li elements would exists', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <View handleCaseStatus={() => {
          }} kc={mockKcProps} match={match}/>
      </I18nextProvider>
    );
    //console.log(wrapper.debug());
    expect(wrapper.find('li')).toHaveLength(0);
  })

  test('View Cases have certain states', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <View handleCaseStatus={() => {
          }} kc={mockKcProps} match={match}/>
      </I18nextProvider>
    );
    expect(wrapper.find('View').state().loading).toBe(true)
    expect(wrapper.find('View').state().data).toEqual(null)
  })

  test('if componentDidMount render values correctly', () => {
    const wrapper = mount(
        <Router>
          <I18nextProvider i18n={i18n}>
            <View handleCaseStatus={() => {
              }} kc={mockKcProps} match={match}/>
          </I18nextProvider>
        </Router>
      );
    mockAxios.mockResponse(responseObj)
    wrapper.update()
    expect(mockAxios.get).toHaveBeenCalledWith('/case/IUJ34ET5', mockHeader);
    expect(wrapper.find('View').state().loading).toBe(false);
    expect(wrapper.find('.view-box').find('table')).toHaveLength(5);
    expect(wrapper.find('.bglite').find('.comment-item')).toHaveLength(1);
  })

  test('if status is Recovered then values are correct', () => {
    const status = 'Recovered';
    responseObj.data.status = status;
    const wrapper = mount(
        <Router>
          <I18nextProvider i18n={i18n}>
            <View handleCaseStatus={() => {
              }} kc={mockKcProps} match={match}/>
          </I18nextProvider>
        </Router>
      );
    mockAxios.mockResponse(responseObj)
    wrapper.update()
    expect(wrapper.find('.listbox Link')).toHaveLength(0);
    expect(wrapper.find('.listbox Button')).toHaveLength(0);
    expect(wrapper.find('.text-success').text()).toEqual(status);
  });
  test('if status is Pending then values are correct', () => {
    const status = 'Pending';
    responseObj.data.status = status;
    const wrapper = mount(
        <Router>
          <I18nextProvider i18n={i18n}>
            <View handleCaseStatus={() => {
              }} kc={mockKcProps} match={match}/>
          </I18nextProvider>
        </Router>
      );
    mockAxios.mockResponse(responseObj)
    wrapper.update()
    expect(wrapper.find('.listbox Link')).toHaveLength(1);
    expect(wrapper.find('.listbox Button')).toHaveLength(2);
    expect(wrapper.find('.text-primary').text()).toEqual(status);
  });
  test('if status is Blocked then values are correct', () => {
    const status = 'Blocked';
    responseObj.data.status = status;
    const wrapper = mount(
        <Router>
          <I18nextProvider i18n={i18n}>
            <View handleCaseStatus={() => {
              }} kc={mockKcProps} match={match}/>
          </I18nextProvider>
        </Router>
      );
    mockAxios.mockResponse(responseObj)
    wrapper.update()
    expect(wrapper.find('.listbox Button')).toHaveLength(1);
    expect(wrapper.find('.text-danger').text()).toEqual(status);
  });
});