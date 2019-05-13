import React, {Component} from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown
} from 'reactstrap';
import moment from "moment";
import esLocale from 'moment/locale/es';
import idLocale from 'moment/locale/id';

class HeaderLanguageDropdown extends Component {

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
    let lang = 'English';
    if(this.props.i18n.language === 'en') {
      lang = 'English';
    } else if(this.props.i18n.language === 'es') {
      lang = 'Spanish';
    } else if(this.props.i18n.language === 'id') {
      lang = 'Indonesian';
    }
    return (
      <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          {lang}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => this.props.switchLanguage('en')}>
            <i className="flag-icon flag-icon-us"></i> English</DropdownItem>
          <DropdownItem onClick={() => this.props.switchLanguage('es')}>
            <i className="flag-icon flag-icon-es"></i> Spanish</DropdownItem>
          <DropdownItem onClick={() => this.props.switchLanguage('id')}>
            <i className="flag-icon flag-icon-id"></i> Indonesian</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  render() {
    if (this.props.i18n.language === 'es') {
      moment.updateLocale('es', esLocale);
    } else if (this.props.i18n.language === 'id') {
      moment.updateLocale('id', idLocale);
    } else {
      moment.locale('en');
    }
    return (
      this.dropAccnt()
    );
  }
}

export default HeaderLanguageDropdown;
