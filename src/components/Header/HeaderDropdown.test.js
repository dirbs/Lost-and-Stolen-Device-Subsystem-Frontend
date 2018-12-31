import React from 'react';
import {shallow, mount} from 'enzyme';
import Sinon from 'sinon';
import HeaderDropdown from "./HeaderDropdown";

const userDetails = {
  preferred_username: "User"
}

describe('HeaderDropdown Component', () => {
  test('renders HeaderDropdown', () => {
      const mockLogout = Sinon.spy();
      const wrapper = shallow(<HeaderDropdown userDetails={userDetails} kc={{logout: mockLogout}}/>);
      expect(wrapper.exists()).toBe(true);
  })

  test('HeaderDropdown contains caret-down icon', () => {
      const mockLogout = Sinon.spy();
      const wrapper = shallow(<HeaderDropdown userDetails={userDetails} kc={{logout: mockLogout}}/>);
      expect(wrapper.contains(<span className="fa fa-caret-down"/>)).toBe(true);
  });

  test('HeaderDropdown List Item contains lock icon', () => {
      const mockLogout = Sinon.spy();
      const wrapper = shallow(<HeaderDropdown userDetails={userDetails} kc={{logout: mockLogout}}/>);
      expect(wrapper.find('DropdownItem').contains(<i className="fa fa-lock"/>)).toBe(true);
  });

  test('should toggle the state.dropdownOpen property when clicking on username dropdown button', () => {
      const mockLogout = Sinon.spy();
      const wrapper = mount(<HeaderDropdown userDetails={userDetails} kc={{logout: mockLogout}}/>);

      // find button and simulate click
      wrapper.find('button').simulate('click')
      expect(wrapper.state().dropdownOpen).toBe(true);

      // find button and simulate click
      wrapper.find('button').simulate('click')
      expect(wrapper.state().dropdownOpen).toBe(false);
  })

  test('if logout button works', ()=>{
    const mockLogout = Sinon.spy();
    const wrapper = mount(<HeaderDropdown userDetails={userDetails} kc={{logout: mockLogout}} />);
    wrapper.find('button').simulate('click');
    expect(mockLogout.callCount).toBe(1);
  })

  test('logout button text is Logout', ()=>{
    const mockLogout = Sinon.spy();
    const wrapper = mount(<HeaderDropdown userDetails={userDetails} kc={{logout: mockLogout}} />);
    expect(wrapper.find('button').text().trim()).toBe('Logout');
  })

  test('render username correctly', ()=> {
    const mockLogout = Sinon.spy()
    const wrapper = mount(<HeaderDropdown kc={{ logout: mockLogout}} userDetails={userDetails}/>);
    expect(wrapper.contains(<span className="mr-3 h6">{userDetails.preferred_username}</span>)).toBe(true);
  })
});