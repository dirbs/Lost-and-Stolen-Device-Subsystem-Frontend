import React from 'react';
import Footer from './Footer';
import {mount, shallow} from 'enzyme';
import { spy } from 'sinon'

describe('Footer Component', ()=> {

  test('if renders correctly', ()=>{
    const wrapper = shallow(<Footer />);
    expect(wrapper).toMatchSnapshot();
  });

  test('if Footer wrapper contains app-footer class', ()=>{
    const wrapper  = mount(<Footer />)
    expect(wrapper.find('footer').hasClass('app-footer')).toBe(true);
  })

  test('contains two divs', ()=>{
    const wrapper  = mount(<Footer />)
    expect(wrapper.find('div')).toHaveLength(2);
  })
})