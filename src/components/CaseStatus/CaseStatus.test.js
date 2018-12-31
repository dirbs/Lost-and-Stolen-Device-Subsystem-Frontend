import React from 'react';
import {mount, shallow} from 'enzyme';
import CaseStatus from './CaseStatus';
import { BrowserRouter as Router } from 'react-router-dom';

const location = {
  pathname: '/case-status/',
  state: {
    details: {
      icon: 'fa fa-check',
      action: 'Register',
      id: 12,
      status: 'Pending'
    }
  }
};
describe('CaseStatus Components', ()=> {
  test("if renders correctly", () => {
    const wrapper = shallow(
      <Router>
        <CaseStatus location={location}/>
      </Router>);
    expect(wrapper).toMatchSnapshot();
  });

  test('link should be wrapped in specific class', () => {
    const wrapper = mount(
      <Router>
        <CaseStatus location={location}/>
      </Router>);
    expect(wrapper.find('.link-box')).toHaveLength(1);
  });

  test('should have a single link', () => {
    const wrapper = mount(
      <Router>
        <CaseStatus location={location}/>
      </Router>);
    expect(wrapper.find('a')).toHaveLength(1);
  });

  test('should render icon correctly', () => {
    const wrapper = mount(
      <Router>
        <CaseStatus location={location}/>
      </Router>);
    expect(wrapper.find('.icon-box').find('i').hasClass('fa fa-check')).toBe(true);
  });
});