import React from 'react';
import {shallow, mount} from 'enzyme';
import Full from './Full';
import {I18nextProvider} from "react-i18next";
import i18n from "./../../i18nTest";
import sinon from 'sinon';
import mockAxios from 'jest-mock-axios';
import { MemoryRouter } from 'react-router';
import NewCase from './../../views/NewCase/NewCase';
import SearchCases from "../../views/SearchCases";
import View from "../../views/Cases/View";
import UpdateCase from "../../views/Cases/UpdateCase";
import Pending from "../../views/Cases/Pending";
import Blocked from "../../views/Cases/Blocked";
import Recovered from "../../views/Cases/Recovered";
import {BrowserRouter as Router} from 'react-router-dom';

const mockKcProps = {
  'isTokenExpired': sinon.spy(),
  logout: sinon.spy()
}

const userDetails = {
  preferred_username: "User"
}

const match = { params: { tracking_id: 'IUJ34ET5' } }

const location = {
  pathname: '/new-case/'
};

const mockHeader = {
  "headers": {
    "Authorization": "Bearer null",
    "Content-Type": "application/json"
  }
}

Object.defineProperty(window, 'matchMedia', {
  value: () => ({
    matches: false,
    addListener: () => {
    },
    removeListener: () => {
    }
  })
});

const historyMock = { push: jest.fn() };

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

describe('Full component', () => {

  beforeEach(() => {
    // values stored in tests will also be available in other tests unless you run
    localStorage.clear();
    localStorage.userInfo = 'eyJzdWIiOiI5YTQ0MDNjMi01YTQ4LTRiNzktOWYzMC0wMmMwY2M3Nzk5ZTAiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJxdWFsY29tbSJ9';
  })

  test("if renders correctly", () => {
    const wrapper = shallow(<Full match={match}/>);
    expect(wrapper).toMatchSnapshot()
  });
  test('If Full component exists',()=>{
    const wrapper = shallow(<Full match={match}/>);
    expect(wrapper.exists()).toBe(true);
  })

  test('/new-case should redirect to New Case Page', () => {
    const mockLogout = sinon.spy();
    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/new-case' ]}>
        <I18nextProvider i18n={i18n}>
          <Full match={match} userDetails={userDetails} kc={mockKcProps} location={location} />
        </I18nextProvider>
      </MemoryRouter>
    );
    expect(wrapper.find(NewCase)).toHaveLength(1);
  });

  test('/search-cases should redirect to Search Page', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/search-cases' ]}>
        <I18nextProvider i18n={i18n}>
          <Full match={match} userDetails={userDetails} kc={mockKcProps} location={location} />
        </I18nextProvider>
      </MemoryRouter>
    );
    expect(wrapper.find(SearchCases)).toHaveLength(1);
  });

  test('/case/{randomID} should redirect to View Page', () => {
    const mockLogout = sinon.spy();
    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/case/IUJ34ET5' ]}>
        <I18nextProvider i18n={i18n}>
          <Full match={match} userDetails={userDetails} kc={mockKcProps} location={location} />
        </I18nextProvider>
      </MemoryRouter>
    );
    expect(wrapper.find(View)).toHaveLength(1);
  });

  test('/case-update/{randomID} should redirect to Update Page', () => {
    const mockLogout = sinon.spy();
    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/case-update/IUJ34ET5' ]}>
        <I18nextProvider i18n={i18n}>
          <Full match={match} userDetails={userDetails} kc={mockKcProps} location={location} />
        </I18nextProvider>
      </MemoryRouter>
    );
    expect(wrapper.find(UpdateCase)).toHaveLength(1);
  });

  test('/cases/Pending should redirect to Pending Page', () => {
    const mockLogout = sinon.spy();
    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/cases/pending' ]}>
        <I18nextProvider i18n={i18n}>
          <Full match={match} userDetails={userDetails} kc={mockKcProps} location={location} />
        </I18nextProvider>
      </MemoryRouter>
    );
    expect(wrapper.find(Pending)).toHaveLength(1);
  });

  test('/cases/blocked should redirect to Blocked Page', () => {
    const mockLogout = sinon.spy();
    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/cases/blocked' ]}>
        <I18nextProvider i18n={i18n}>
          <Full match={match} userDetails={userDetails} kc={mockKcProps} location={location} />
        </I18nextProvider>
      </MemoryRouter>
    );
    expect(wrapper.find(Blocked)).toHaveLength(1);
  });

  test('/cases/recovered should redirect to Recovered Page', () => {
    const mockLogout = sinon.spy();
    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/cases/recovered' ]}>
        <I18nextProvider i18n={i18n}>
          <Full match={match} userDetails={userDetails} kc={mockKcProps} location={location} />
        </I18nextProvider>
      </MemoryRouter>
    );
    expect(wrapper.find(Recovered)).toHaveLength(1);
  });

  test('/ should redirect to Search Page', () => {
    const mockLogout = sinon.spy();
    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/' ]}>
        <I18nextProvider i18n={i18n}>
          <Full match={match} userDetails={userDetails} kc={mockKcProps} location={location} />
        </I18nextProvider>
      </MemoryRouter>
    );
    expect(wrapper.find(SearchCases)).toHaveLength(1);
  });

});
