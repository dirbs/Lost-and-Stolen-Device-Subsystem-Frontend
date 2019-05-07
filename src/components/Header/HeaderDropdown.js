import React, {Component} from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown
} from 'reactstrap';
import i18n from './../../i18n';

class HeaderDropdown extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  dropAccnt() {
    return (
      <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle} className='dd-itereg'>
        <DropdownToggle nav>
          {i18n.t('hI')}, <span className="h6">{this.props.userDetails.preferred_username}</span>
          <span className="fa fa-caret-down"></span>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={this.props.kc.logout}><i className="fa fa-lock"></i>{i18n.t('logOut')}</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  render() {
    return (
      this.dropAccnt()
    );
  }
}

export default HeaderDropdown;
