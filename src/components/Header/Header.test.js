import React from 'react';
import {shallow, mount} from 'enzyme';
import Header from "./Header";
 const userDetails = {
  preferred_username: "User"
}
 describe('Header component',()=>{
  /**
   * Test if header renders successfully
   */
  test('If header renders',()=>{
    const wrapper = shallow(<Header/>);
    expect(wrapper.exists()).toBe(true);
  })
  /**
   * Test if header consists of class
   */
  test('If header has class',()=>{
    const wrapper = shallow(<Header/>);
    expect(wrapper.find('.app-header.navbar').length).toEqual(1)
  })

  test('Brand have specific headings', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper.find('NavbarBrand').find('h5').length).toEqual(2);
  })

  test('Brand have specific classes', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper.find('NavbarBrand').find('h5').at(0).hasClass('navbar-brand-minimized')).toBe(true);
    expect(wrapper.find('NavbarBrand').find('h5').at(1).hasClass('navbar-brand-full')).toBe(true);
  })

  test('Nav has specific class', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper.find('Nav').props().navbar).toBe(true);
    expect(wrapper.find('Nav').props().vertical).toBe(false);
  })
  /**
   * Test if header consists of ul
   */
  test('If header has navbar-toggler-icon',()=>{
    const wrapper = shallow(<Header/>);
    expect(wrapper.contains(<span className="navbar-toggler-icon"></span>)).toBe(true);
  })

  test('should toggle sidebar', () => {
    const wrapper = shallow(<Header />);
    wrapper.find('NavbarToggler').at(1).simulate('click', {
        preventDefault: () => {
      }
    })
    expect(document.body.classList.contains('sidebar-hidden'))
  })

  test('should toggle mobile sidebar', () => {
    const wrapper = shallow(<Header />);
    wrapper.find('NavbarToggler').at(0).simulate('click', {
        preventDefault: () => {
      }
    })
    expect(document.body.classList.contains('sidebar-mobile-show'))
  })

})