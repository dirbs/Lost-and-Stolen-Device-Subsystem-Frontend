import React from 'react';
import {shallow, mount, render} from 'enzyme';
import SearchCases from './SearchCases';
import {I18nextProvider} from "react-i18next";
import i18n from "./../../i18nTest"
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

let responseObj = {
  data: {
    cases: [{
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
        status: 'Pending',
        tracking_id: 'IUJ34ET5',
        updated_at: '2018-01-01 10:10:10'
      }],
    count: 1,
    limit: 10,
    start: 1
  }
}

afterEach(() => {
  // cleaning up the mess left behind the previous test
  mockAxios.reset();
});

describe('Search component', () => {
  test("if renders correctly", () => {
    const wrapper = shallow(<SearchCases/>);
    expect(wrapper).toMatchSnapshot()
  });
  test('If SearchCases renders',()=>{
    const wrapper = shallow(<SearchCases/>);
    expect(wrapper.exists()).toBe(true);
  })
  test('SearchCases if renders no li elements would exists', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <SearchCases/>
      </I18nextProvider>
    );
    //console.log(wrapper.debug());
    expect(wrapper.find('li')).toHaveLength(0);
  })

  test('SearchCases have certain states', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <SearchCases/>
      </I18nextProvider>
    );
    const PAGE_LIMIT = 10;
    //console.log(wrapper.debug());
    expect(wrapper.find('SearchCases').state().showAllFilters).toBe(false)
    expect(wrapper.find('SearchCases').state().apiFetched).toBe(false)
    expect(wrapper.find('SearchCases').state().loading).toBe(false)
    expect(wrapper.find('SearchCases').state().totalCases).toBe(0)
    expect(wrapper.find('SearchCases').state().limit).toBe(PAGE_LIMIT)
    expect(wrapper.find('SearchCases').state().searchQuery).toEqual({})
  })

  test('showAllFilters button toggling works', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <SearchCases/>
      </I18nextProvider>
    );
    const button = wrapper.find('Button').at(1).find('button');
    button.simulate('click')
    expect(wrapper.find('SearchCases').state().showAllFilters).toBe(true);
    button.simulate('click')
    expect(wrapper.find('SearchCases').state().showAllFilters).toBe(false);
  })

  test('when submit button is clicked', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <SearchCases kc={mockKcProps}/>
      </I18nextProvider>
    );
    const submitButton = wrapper.find('Button').at(2).find('button');
    submitButton.simulate('submit')
    expect(wrapper.find('SearchCases').state().apiFetched).toBe(true);
  })

  test("if submit button clicked then call API and show records", () => {
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchCases handleCaseStatus={() => {
          }} kc={mockKcProps}/>
        </I18nextProvider>
      </Router>
    )

    // console.log(wrapper.find('SearchCases').state());
    const submitButton = wrapper.find('Button').at(2).find('button');
    submitButton.simulate('submit')
    mockAxios.mockResponse(responseObj)
    wrapper.update()
    expect(mockAxios.post).toHaveBeenCalledWith('/search?start=1&limit=10', {
      "limit": 10,
      "search_args": {},
      "start": 1
    }, mockHeader);
    expect(wrapper.find('SearchCases').state().totalCases).toEqual(1);
    expect(wrapper.find('SearchCases').find('.listbox li.casebox')).toHaveLength(1);
    expect(wrapper.find('.listbox Button')).toHaveLength(2);
    expect(wrapper.find('.case-actions Link')).toHaveLength(1);
    expect(wrapper.find('.listbox .text-primary').text()).toEqual('1 Case found');
  });
  test("if API respond with Server Error", () => {
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchCases handleCaseStatus={() => {
          }} kc={mockKcProps}/>
        </I18nextProvider>
      </Router>
    )

    // console.log(wrapper.find('SearchCases').state());
    const submitButton = wrapper.find('Button').at(2).find('button');
    submitButton.simulate('submit')
    // simulating a server response
    mockAxios.mockError()
    wrapper.update()
    expect(mockAxios.post).toHaveBeenCalledWith('/search?start=1&limit=10', {
      "limit": 10,
      "search_args": {},
      "start": 1
    }, mockHeader);
    expect(wrapper.find('SearchCases').state().totalCases).toEqual(0);
  });

  test("provide Created and Updated Date inputs and submit search form", () => {
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchCases kc={mockKcProps} handleCaseStatus={() => {
          }} />
        </I18nextProvider>
      </Router>
    )
    // Populate updated_at Start and End Date
    //console.log(wrapper.find('SearchForm').find('button').debug());
    wrapper.find('SearchForm').find('input').at(1).simulate('change', {
      target: {
        value: '2018-12-05',
        name: 'your_unique_start_date_id'
      }
    });
    wrapper.find('SearchForm').find('input').at(2).simulate('change', {
      target: {
        value: '2018-12-15',
        name: 'your_unique_end_date_id'
      }
    });
    const submitButton = wrapper.find('button').at(5);
    submitButton.simulate('submit')
    // simulating a server response
    mockAxios.mockResponse(responseObj)
    wrapper.update()
    expect(mockAxios.post).toHaveBeenCalledWith('/search?start=1&limit=10', {
      "limit": 10,
      "search_args": {
        "updated_at": "2018-12-05,2018-12-15",
      },
      "start": 1
    }, mockHeader);
    expect(wrapper.find('SearchCases').state().totalCases).toEqual(1);
    //expect(table.at(0).find('td').at(4).text()).toEqual('2018-01-01 10:10:10');
    //expect(table.at(0).find('td').at(5).text()).toEqual('2018-01-01 10:10:10');
  });
});