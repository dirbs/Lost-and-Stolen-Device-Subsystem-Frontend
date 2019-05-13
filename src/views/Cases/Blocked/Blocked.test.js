import React from 'react';
import {shallow, mount, render} from 'enzyme';
import Blocked from './Blocked';
import {I18nextProvider} from "react-i18next";
import i18n from "./../../../i18nTest"
import sinon from 'sinon'
import mockAxios from 'jest-mock-axios';
import {BrowserRouter as Router} from 'react-router-dom';

Object.defineProperty(window, 'matchMedia', {
  value: () => ({
    matches: false,
    addListener: () => {
    },
    removeListener: () => {
    }
  })
});

const mockKcProps = {
  'isTokenExpired': sinon.spy()
}

const mockHeader = {
  "headers": {
    "Authorization": "Bearer null",
    "Content-Type": "application/json"
  }
}

afterEach(() => {
  // cleaning up the mess left behind the previous test
  mockAxios.reset();
});

describe('Blocked component', () => {
  test("if renders correctly", () => {
    const wrapper = shallow(<Blocked/>);
    expect(wrapper).toMatchSnapshot()
  });
  test('If Blocked Cases renders',()=>{
    const wrapper = shallow(<Blocked/>);
    expect(wrapper.exists()).toBe(true);
  })
  test('Blocked Cases if renders no li elements would exists', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Blocked handleCaseStatus={() => {
          }} kc={mockKcProps}/>
      </I18nextProvider>
    );
    //console.log(wrapper.debug());
    expect(wrapper.find('li')).toHaveLength(0);
  })

  test('Blocked Cases have certain states', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Blocked handleCaseStatus={() => {
          }} kc={mockKcProps}/>
      </I18nextProvider>
    );
    const PAGE_LIMIT = 10;
    //console.log(wrapper.debug());
    expect(wrapper.find('Blocked').state().loading).toBe(true)
    expect(wrapper.find('Blocked').state().totalCases).toBe(0)
    expect(wrapper.find('Blocked').state().limit).toBe(PAGE_LIMIT)
    expect(wrapper.find('Blocked').state().data).toEqual(null)
    expect(wrapper.find('Blocked').state().activePage).toEqual(1)
  })

  test('if componentDidMount render values correctly', () => {
    const wrapper = mount(
        <Router>
          <I18nextProvider i18n={i18n}>
            <Blocked handleCaseStatus={() => {
              }} kc={mockKcProps}/>
          </I18nextProvider>
        </Router>
      );
    let responseObj = {
      data: {
        cases: [{
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
            status: 'Blocked',
            tracking_id: 'IUJ34ET5',
            updated_at: '2018-01-01 10:10:10',
            created_at: '2018-10-29 10:34:34'
          }],
        count: 1,
        limit: 10,
        start: 1
      }
    }
    mockAxios.mockResponse(responseObj)
    wrapper.update()
    const PAGE_LIMIT = 10;
    expect(mockAxios.get).toHaveBeenCalledWith('/cases?status=2&start=1&limit=10', mockHeader);
    expect(wrapper.find('Blocked').state().totalCases).toEqual(1);
    expect(wrapper.find('Blocked').state().loading).toBe(false);
    expect(wrapper.find('Blocked').state().limit).toBe(PAGE_LIMIT);
    expect(wrapper.find('Blocked').find('.listbox li.casebox')).toHaveLength(1);
    expect(wrapper.find('Blocked').find('.case-blocked')).toHaveLength(1);
    expect(wrapper.find('.case-actions Button')).toHaveLength(1);
    expect(wrapper.find('.listbox .text-primary').text()).toEqual('1 Blocked case found');
  })
});