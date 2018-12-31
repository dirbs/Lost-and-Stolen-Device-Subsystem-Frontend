import React from 'react';
import {shallow, mount} from 'enzyme';
import Sidebar from './Sidebar';
import { I18nextProvider } from 'react-i18next';
import i18n from './../../i18nTest';
import {BrowserRouter as Router} from 'react-router-dom';

const location = {
  pathname: '/new-case/'
};

describe('Sidebar component', () => {

  /* Test if Sidebar renders successfully */
  test('If Sidebar renders successfully', () => {
    const wrapper = shallow(<Sidebar t={() => ''} location={location} />);
    expect(wrapper.exists()).toBe(true);
  })

  /* Test nav item consists of length */
  test('If nav item exists', () => {
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <Sidebar t={() => ''}  location={location} />
        </I18nextProvider>
      </Router>
      );
    expect(wrapper.find('NavItem').exists()).toBe(true);
  });

  test('If Sidebar has specific wrapper class', () => {
    const wrapper = shallow(<Sidebar t={() => ''} location={location} />);
    expect(wrapper.find('.sidebar').length).toEqual(1);
  });
})