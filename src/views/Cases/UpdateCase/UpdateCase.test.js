import React from 'react';
import {shallow, mount, render} from 'enzyme';
import UpdateCase from './UpdateCase';
import {I18nextProvider} from "react-i18next";
import i18n from "./../../../i18nTest"
import sinon from 'sinon'
import mockAxios from 'jest-mock-axios';
import {BrowserRouter as Router} from 'react-router-dom';
import {getUserInfo} from "../../../utilities/helpers";

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

describe('UpdateCase component', () => {

  beforeEach(() => {
    // values stored in tests will also be available in other tests unless you run
    localStorage.clear();
    localStorage.userInfo = 'eyJzdWIiOiI5YTQ0MDNjMi01YTQ4LTRiNzktOWYzMC0wMmMwY2M3Nzk5ZTAiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJxdWFsY29tbSJ9';
  })

  test("if renders correctly", () => {
    const wrapper = shallow(<UpdateCase match={match}/>);
    expect(wrapper).toMatchSnapshot()
  });

  test('If UpdateCase exists',()=>{
    const wrapper = shallow(<UpdateCase match={match}/>);
    expect(wrapper.exists()).toBe(true);
  })

  test('UpdateCase have certain states', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <UpdateCase handleCaseStatus={() => {
          }} kc={mockKcProps} match={match}/>
      </I18nextProvider>
    );
    expect(wrapper.find('UpdateCase').state().loading).toBe(true)
    expect(wrapper.find('UpdateCase').state().data).toEqual(null)
  })

  test('if validations work fine', () => {
    let responseInvalidObj = {
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
            personal_details: { // invalid mock personal details
              full_name: null,
              email: null,
              dob: null,
              gin: null,
              address: null,
              number: null
            },
            status: 'Recovered',
            tracking_id: 'IUJ34ET5',
            updated_at: '2018-01-01 10:10:10',
            created_at: '2018-10-29 10:34:34'
          }
    }
    const wrapper = mount(
        <Router>
          <I18nextProvider i18n={i18n}>
            <UpdateCase handleCaseStatus={() => {
              }} kc={mockKcProps} match={match}/>
          </I18nextProvider>
        </Router>
      );
    mockAxios.mockResponse(responseInvalidObj)
    wrapper.update()
    expect(mockAxios.get).toHaveBeenCalledWith('/case/IUJ34ET5', mockHeader);
    wrapper.find('form').simulate('submit');
    expect(wrapper.find('Formik').state().errors.full_name).toEqual('This field is Required');
    expect(wrapper.find('Formik').state().errors.oneOfFields).toEqual('One of the fields is required');
  });

  test('if DOB is from future', () => {
    let responseInvalidObj = {
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
              full_name: null,
              email: null,
              dob: '2020-12-27', // invalid mock DOB
              gin: null,
              address: null,
              number: null
            },
            status: 'Recovered',
            tracking_id: 'IUJ34ET5',
            updated_at: '2018-01-01 10:10:10',
            created_at: '2018-10-29 10:34:34'
          }
    }
    const wrapper = mount(
        <Router>
          <I18nextProvider i18n={i18n}>
            <UpdateCase handleCaseStatus={() => {
              }} kc={mockKcProps} match={match}/>
          </I18nextProvider>
        </Router>
      );
    mockAxios.mockResponse(responseInvalidObj)
    wrapper.update()
    expect(mockAxios.get).toHaveBeenCalledWith('/case/IUJ34ET5', mockHeader);
    wrapper.find('form').simulate('submit');
    expect(wrapper.find('Formik').state().errors.dob).toEqual("Date of Birth can't be in future");
  });

  test('if DOB is from past', () => {
    let resDOBInvalidObj = {
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
              full_name: null,
              email: null,
              dob: '1880-12-27', // invalid mock DOB
              gin: null,
              address: null,
              number: null
            },
            status: 'Recovered',
            tracking_id: 'IUJ34ET5',
            updated_at: '2018-01-01 10:10:10',
            created_at: '2018-10-29 10:34:34'
          }
    }
    const wrapper = mount(
        <Router>
          <I18nextProvider i18n={i18n}>
            <UpdateCase handleCaseStatus={() => {
              }} kc={mockKcProps} match={match}/>
          </I18nextProvider>
        </Router>
      );
    mockAxios.mockResponse(resDOBInvalidObj)
    wrapper.update()
    expect(mockAxios.get).toHaveBeenCalledWith('/case/IUJ34ET5', mockHeader);
    wrapper.find('form').simulate('submit');
    expect(wrapper.find('Formik').state().errors.dob).toEqual("Date of Birth can't be that old");
  });

  test('if email is invalid', () => {
    let resInvalidEmailObj = {
      data: {
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
              full_name: null,
              email: 'asdfasfsdf', // invalid mock Email
              dob: null,
              gin: null,
              address: null,
              number: null
            },
            status: 'Recovered',
            tracking_id: 'IUJ34ET5',
            updated_at: '2018-01-01 10:10:10',
            created_at: '2018-10-29 10:34:34'
          }
    }
    const wrapper = mount(
        <Router>
          <I18nextProvider i18n={i18n}>
            <UpdateCase handleCaseStatus={() => {
              }} kc={mockKcProps} match={match}/>
          </I18nextProvider>
        </Router>
      );
    mockAxios.mockResponse(resInvalidEmailObj)
    wrapper.update()
    expect(mockAxios.get).toHaveBeenCalledWith('/case/IUJ34ET5', mockHeader);
    wrapper.find('form').simulate('submit');
    expect(wrapper.find('Formik').state().errors.email).toEqual("Invalid email address");
  });

  test('if comment text is greater than 1000 characters', () => {
    let resInvalidCommentObj = {
      data: {
            comments: [{
              comment: "test comment",
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
              full_name: null,
              email: 'asdfasfsdf',
              dob: null,
              gin: null,
              address: null,
              number: null
            },
            status: 'Recovered',
            tracking_id: 'IUJ34ET5',
            updated_at: '2018-01-01 10:10:10',
            created_at: '2018-10-29 10:34:34'
          }
    }
    const wrapper = mount(
        <Router>
          <I18nextProvider i18n={i18n}>
            <UpdateCase handleCaseStatus={() => {
              }} kc={mockKcProps} match={match}/>
          </I18nextProvider>
        </Router>
      );
    mockAxios.mockResponse(resInvalidCommentObj)
    wrapper.update()
    expect(mockAxios.get).toHaveBeenCalledWith('/case/IUJ34ET5', mockHeader);
    const inputtedData = {
      case_comment: {
        target: {
          value: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Na',
          name: 'case_comment'
        }
      }
    };
    wrapper.find('textarea').at(0).simulate('change', inputtedData.case_comment);
    wrapper.update();
    wrapper.find('form').simulate('submit');
    expect(wrapper.find('Formik').state().errors.case_comment).toEqual("Must be 1000 characters or less");
  });

  test('if componentDidMount render values correctly', () => {
    const wrapper = mount(
        <Router>
          <I18nextProvider i18n={i18n}>
            <UpdateCase handleCaseStatus={() => {
              }} kc={mockKcProps} match={match}/>
          </I18nextProvider>
        </Router>
      );
    mockAxios.mockResponse(responseObj)
    wrapper.update()
    expect(mockAxios.get).toHaveBeenCalledWith('/case/IUJ34ET5', mockHeader);
    expect(wrapper.find('UpdateCase').state().loading).toBe(false);
    expect(wrapper.find('UpdateCase').state().caseTrackingId).toEqual(responseObj.data.tracking_id);
    expect(wrapper.find('.view-box').find('table')).toHaveLength(4);
    const inputtedData = {
      case_comment: {
        target: {
          value: 'testing comment',
          name: 'case_comment'
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
          name: 'alternate_number'
        }
      }
    };
    const submittedCase = {
      status_args: {
        user_id : '9a4403c2-5a48-4b79-9f30-02c0cc7799e0',
        username : 'qualcomm',
        case_comment: 'testing comment'
      },
      personal_details: {
        address: "test-address",
        dob: "1990-01-01",
        email: "test@example.com",
        full_name: "test-name",
        gin: "12345678912345",
        number: "03001234567"
      }
    }
    const updateResponse = {
      data: {"tracking_id": "IUJ34ET5", "message": "Case updated successfully"}
    }
    wrapper.find('input').at(0).simulate('change', inputtedData.full_name);
    wrapper.find('input').at(1).simulate('change', inputtedData.dob);
    wrapper.find('input').at(2).simulate('change', inputtedData.gin);
    wrapper.find('input').at(3).simulate('change', inputtedData.address);
    wrapper.find('input').at(4).simulate('change', inputtedData.email);
    wrapper.find('input').at(5).simulate('change', inputtedData.alternate_number);
    wrapper.find('textarea').at(0).simulate('change', inputtedData.case_comment);
    wrapper.update();
    const submitButton = wrapper.find('button').at(1);
    submitButton.simulate('submit');
    expect(mockAxios.put).toHaveBeenCalledWith('/case/IUJ34ET5', submittedCase, mockHeader);
    mockAxios.mockResponse(updateResponse)
    wrapper.update()
    expect(wrapper.find('UpdateCase').state().caseSubmitted).toBe(true);
  })
});