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
  });
  test('SearchCases if renders no li elements would exists', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <SearchCases/>
      </I18nextProvider>
    );
    expect(wrapper.find('li')).toHaveLength(0);
  });

  test('SearchCases have certain states', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <SearchCases/>
      </I18nextProvider>
    );
    const PAGE_LIMIT = 10;
    expect(wrapper.find('SearchCases').state().showAllFilters).toBe(false)
    expect(wrapper.find('SearchCases').state().apiFetched).toBe(false)
    expect(wrapper.find('SearchCases').state().loading).toBe(false)
    expect(wrapper.find('SearchCases').state().totalCases).toBe(0)
    expect(wrapper.find('SearchCases').state().limit).toBe(PAGE_LIMIT)
    expect(wrapper.find('SearchCases').state().searchQuery).toEqual({})
    expect(wrapper.find('SearchCases').state().currSearchQuery).toEqual([])
  });

  test('showAllFilters button toggling works', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <SearchCases/>
      </I18nextProvider>
    );
    const button = wrapper.find('Button').at(0).find('button');
    button.simulate('click')
    expect(wrapper.find('SearchCases').state().showAllFilters).toBe(true);
    button.simulate('click')
    expect(wrapper.find('SearchCases').state().showAllFilters).toBe(false);
  });

  test('when submit button is clicked', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <SearchCases kc={mockKcProps}/>
      </I18nextProvider>
    );
    const submitButton = wrapper.find('Button').at(1).find('button');
    submitButton.simulate('submit')
    expect(wrapper.find('SearchCases').state().apiFetched).toBe(true);
  });

  test("if submit button clicked then call API and show records", () => {
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchCases handleCaseStatus={() => {
          }} kc={mockKcProps}/>
        </I18nextProvider>
      </Router>
    )

    const submitButton = wrapper.find('Button').at(1).find('button');
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
    expect(wrapper.find('.listbox Button')).toHaveLength(1);
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

    const submitButton = wrapper.find('Button').at(1).find('button');
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
    const submitButton = wrapper.find('button').at(4);
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
  });

  test("Provide other form inputs and submit search form", () => {
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
					  incident_date: '2019-01-01,2019-01-02',
					  incident_nature: 'Lost'
				  },
				  personal_details: {
					  full_name: 'test',
					  email: 'test@example.com',
					  dob: '1990-01-05',
					  gin: '0123',
					  address: 'test address',
					  number: '923001234567'
				  },
				  status: 'Pending',
				  tracking_id: 'IUJ34ET5',
				  updated_at: '2018-01-01,2018-01-04'
			  }],
			  count: 1,
			  limit: 10,
			  start: 1
		  }
	  }
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchCases kc={mockKcProps} handleCaseStatus={() => {
          }} />
        </I18nextProvider>
      </Router>
    );
    // Populate all form inputs
    wrapper.find('SearchForm').find('input').at(0).simulate('change', {
      target: {
        value: 'IUJ34ET5',
        name: 'tracking_id'
      }
    });
	  wrapper.find('SearchForm').find('input').at(1).simulate('change', {
		  target: {
			  value: '2018-01-01',
			  name: 'your_unique_start_date_id'
		  }
	  });
	  wrapper.find('SearchForm').find('input').at(2).simulate('change', {
		  target: {
			  value: '2018-01-04',
			  name: 'your_unique_end_date_id'
		  }
	  });
    wrapper.find('SearchForm').find('input').at(3).simulate('change', {
      target: {
        value: '03231234567',
        name: 'msisdns'
      }
    });
    wrapper.find('SearchForm').find('input').at(4).simulate('change', {
      target: {
        value: '123456787655345',
	      name: 'imeis'
      }
    });
    wrapper.find('SearchForm').find('input').at(5).simulate('change', {
      target: {
        value: '2019-01-01',
        name: 'your_unique_start_date_id'
      }
    });
    wrapper.find('SearchForm').find('input').at(6).simulate('change', {
      target: {
        value: '2019-01-02',
        name: 'your_unique_end_date_id'
      }
    });
	  wrapper.find('SearchForm').find('input').at(7).simulate('change', {
		  target: {
			  value: 'test',
			  name: 'full_name'
		  }
	  });
	  wrapper.find('SearchForm').find('input').at(8).simulate('change', {
		  target: {
			  value: '0123',
			  name: 'gin'
		  }
	  });
	  wrapper.find('SearchForm').find('input').at(9).simulate('change', {
		  target: {
			  value: 'test@example.com',
			  name: 'email'
		  }
	  });
	  wrapper.find('SearchForm').find('input').at(10).simulate('change', {
		  target: {
			  value: '1990-01-05',
			  name: 'dob'
		  }
	  });
	  wrapper.find('SearchForm').find('input').at(11).simulate('change', {
		  target: {
			  value: 'test address',
			  name: 'address'
		  }
	  });
	  wrapper.find('SearchForm').find('input').at(12).simulate('change', {
		  target: {
			  value: '923001234567',
			  name: 'alternate_number'
		  }
	  });
	  wrapper.find('SearchForm').find('input').at(13).simulate('change', {
		  target: {
			  value: 'test brand',
			  name: 'brand'
		  }
	  });
	  wrapper.find('SearchForm').find('input').at(14).simulate('change', {
		  target: {
			  value: 'test model',
			  name: 'model'
		  }
	  });
	  wrapper.find('SearchForm').find('input').at(15).simulate('change', {
		  target: {
			  value: 'test description',
			  name: 'description'
		  }
	  });
	  wrapper.find('SearchForm').find('select').at(0).simulate('change', {
		  target: {
			  value: 'Pending',
			  name: 'status'
		  }
	  });
	  wrapper.find('SearchForm').find('select').at(1).simulate('change', {
		  target: {
			  value: 'Lost',
			  name: 'incident'
		  }
	  });
	  const submitButton = wrapper.find('button').at(4);
	  submitButton.simulate('submit');
	  // simulating a server response
	  mockAxios.mockResponse(responseObj);
	  wrapper.update();
	  expect(wrapper.find('SearchCases').state().totalCases).toEqual(1);
	  expect(wrapper.find('SearchCases').find('.selected-filters')).toHaveLength(1);
	  expect(wrapper.find('SearchCases').find('.selected-filters li')).toHaveLength(14);
	  let closeSelectedFilter = wrapper.find('.selected-filters li').at(0).find('p');

	  closeSelectedFilter.simulate('click');
	  expect(wrapper.find('SearchCases').find('.selected-filters li')).toHaveLength(13);
	  expect(wrapper.find('Formik').state().values.tracking_id).toEqual('');

	  closeSelectedFilter.simulate('click');
	  expect(wrapper.find('Formik').state().values.status).toEqual('');

	  closeSelectedFilter.simulate('click');
	  expect(wrapper.find('Formik').state().values.updated_at).toEqual('');

	  closeSelectedFilter.simulate('click');
	  expect(wrapper.find('Formik').state().values.address).toEqual('');

	  closeSelectedFilter.simulate('click');
	  expect(wrapper.find('Formik').state().values.gin).toEqual('');

	  closeSelectedFilter.simulate('click');
	  expect(wrapper.find('Formik').state().values.full_name).toEqual('');

	  closeSelectedFilter.simulate('click');
	  expect(wrapper.find('Formik').state().values.dob).toEqual('');

	  closeSelectedFilter.simulate('click');
	  expect(wrapper.find('Formik').state().values.alternate_number).toEqual('');

	  closeSelectedFilter.simulate('click');
	  expect(wrapper.find('Formik').state().values.email).toEqual('');

	  closeSelectedFilter.simulate('click');
	  expect(wrapper.find('Formik').state().values.incident).toEqual('');

	  closeSelectedFilter.simulate('click');
	  expect(wrapper.find('Formik').state().values.date_of_incident).toEqual('');

	  closeSelectedFilter.simulate('click');
	  expect(wrapper.find('Formik').state().values.brand).toEqual('');

	  closeSelectedFilter.simulate('click');
	  expect(wrapper.find('Formik').state().values.model).toEqual('');

	  closeSelectedFilter.simulate('click');
	  expect(wrapper.find('Formik').state().values.description).toEqual('');

  });

  test("Date of birth and Email input error renders", () => {
	  const wrapper = mount(
		  <Router>
			  <I18nextProvider i18n={i18n}>
				  <SearchCases kc={mockKcProps} handleCaseStatus={() => {
				  }} />
			  </I18nextProvider>
		  </Router>
	  );
	  // Populate all form inputs
	  wrapper.find('SearchForm').find('input').at(9).simulate('change', {
		  target: {
			  value: 'test@example',
			  name: 'email'
		  }
	  });
	  wrapper.find('SearchForm').find('input').at(10).simulate('change', {
		  target: {
			  value: '1899-01-05',
			  name: 'dob'
		  }
	  });
	  let submitButton = wrapper.find('button').at(4);
	  submitButton.simulate('submit');
	  wrapper.update();
	  expect(wrapper.find('Formik').state().errors.email).toEqual('Invalid email address');
	  expect(wrapper.find('Formik').state().errors.dob).toEqual('Date of birth can\'t be that old');
	  wrapper.find('SearchForm').find('input').at(9).simulate('change', {
		  target: {
			  value: '',
			  name: 'email'
		  }
	  });
	  wrapper.find('SearchForm').find('input').at(10).simulate('change', {
		  target: {
			  value: '2025-01-05',
			  name: 'dob'
		  }
	  });
	  expect(wrapper.find('Formik').state().errors.dob).toEqual('Date of birth can\'t be in future');
  });

  test("Clear all filters button click works", () => {
	  const wrapper = mount(
		  <Router>
			  <I18nextProvider i18n={i18n}>
				  <SearchCases kc={mockKcProps} handleCaseStatus={() => {
				  }} />
			  </I18nextProvider>
		  </Router>
	  );
	  // Populate all form inputs
	  wrapper.find('SearchForm').find('input').at(1).simulate('change', {
		  target: {
			  value: '2018-01-01',
			  name: 'your_unique_start_date_id'
		  }
	  });
	  wrapper.find('SearchForm').find('input').at(2).simulate('change', {
		  target: {
			  value: '2018-01-04',
			  name: 'your_unique_end_date_id'
		  }
	  });
	  wrapper.find('SearchForm').find('input').at(5).simulate('change', {
		  target: {
			  value: '2019-01-01',
			  name: 'your_unique_start_date_id'
		  }
	  });
	  wrapper.find('SearchForm').find('input').at(6).simulate('change', {
		  target: {
			  value: '2019-01-02',
			  name: 'your_unique_end_date_id'
		  }
	  });
	  wrapper.find('SearchForm').find('input').at(10).simulate('change', {
		  target: {
			  value: '1990-01-05',
			  name: 'dob'
		  }
	  });
	  let submitButton = wrapper.find('button').at(4);
	  submitButton.simulate('submit');
	  mockAxios.mockResponse(responseObj);
	  wrapper.update();
	  expect(wrapper.find('SearchCases').find('.selected-filters li')).toHaveLength(3);
	  expect(wrapper.find('Formik').state().values.updated_at).toEqual('2018-01-01,2018-01-04');
	  expect(wrapper.find('Formik').state().values.date_of_incident).toEqual('2019-01-01,2019-01-02');
	  expect(wrapper.find('Formik').state().values.dob).toEqual('1990-01-05');
	  let clearButton = wrapper.find('Formik').find('Button').at(0);
	  clearButton.simulate('click');
	  expect(wrapper.find('SearchCases').find('.selected-filters li')).toHaveLength(0);
	  expect(wrapper.find('Formik').state().values.updated_at).toEqual('');
	  expect(wrapper.find('Formik').state().values.date_of_incident).toEqual('');
	  expect(wrapper.find('Formik').state().values.dob).toEqual('');
  });

  test("Found more than 1 case", () => {
	  let responseObj = {
		  data: {
			  cases: [
			  	{
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
				  },
				  {
					  creator: {
						  username: 'test',
						  user_id: '9a4403c2-5a48-4b79-9f30-02c0cc7799e0'
					  },
					  device_details: {
						  imeis: ['123456787655346'],
						  description: 'test description',
						  brand: 'test brand',
						  model_name: 'test model',
						  msisdns: ['03231234568']
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
					  tracking_id: 'IUJ34ET6',
					  updated_at: '2018-01-01 10:10:10'
				  }
			  ],
			  count: 2,
			  limit: 10,
			  start: 1
		  }
	  }
	  const wrapper = mount(
		  <Router>
			  <I18nextProvider i18n={i18n}>
				  <SearchCases kc={mockKcProps} handleCaseStatus={() => {
				  }} />
			  </I18nextProvider>
		  </Router>
	  );
	  let submitButton = wrapper.find('button').at(4);
	  submitButton.simulate('submit');
	  mockAxios.mockResponse(responseObj);
	  wrapper.update();
	  expect(wrapper.find('.listbox').find('Card').at(0).find('.text-primary').text()).toEqual('2 Cases found');
  });

  test("No case found", () => {
	  let responseObj = {
		  data: {
			  cases: [],
			  count: 0,
			  limit: 10,
			  start: 1
		  }
	  }
	  const wrapper = mount(
		  <Router>
			  <I18nextProvider i18n={i18n}>
				  <SearchCases kc={mockKcProps} handleCaseStatus={() => {
				  }} />
			  </I18nextProvider>
		  </Router>
	  );
	  let submitButton = wrapper.find('button').at(4);
	  submitButton.simulate('submit');
	  mockAxios.mockResponse(responseObj);
	  wrapper.update();
	  expect(wrapper.find('.listbox').find('Card').at(0).find('CardHeader').text()).toEqual('No cases found');
  });

});