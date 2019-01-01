import React from 'react';
import {shallow, mount} from 'enzyme';
import Breadcrumb from './Breadcrumb';
import { I18nextProvider } from 'react-i18next';
import i18n from './../../i18nTest';
import {MemoryRouter} from 'react-router';
import { Route } from "react-router-dom";

const location = {
  pathname: '/case-status/'
};

describe('Breadcrumb component', () => {

  /* Test if Breadcrumb renders successfully */
  test('If Breadcrumb renders successfully', () => {
    const wrapper = shallow(<Breadcrumb />);
    expect(wrapper.exists()).toBe(true);
  })
})