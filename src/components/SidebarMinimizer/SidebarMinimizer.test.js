import React from 'react';
import {shallow, mount, render} from 'enzyme';
import sinon from 'sinon';
import SidebarMinimizer from './SidebarMinimizer'


describe('SidebarMinimizer', () => {
  test('renders button with class="sidebar-minimizer"', () => {
    const wrapper = shallow(<SidebarMinimizer />);
    expect(wrapper
    .contains('<button class="sidebar-minimizer mt-auto" type="button"></button>'))
  })
  test('should call handleClick', () => {
    const wrapper = shallow(<SidebarMinimizer />);
    wrapper.find('button').simulate('click')
    expect(document.body.classList.contains('sidebar-minimized'))
  })
})