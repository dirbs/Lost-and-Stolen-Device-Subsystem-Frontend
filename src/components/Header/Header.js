import React, {Component} from 'react';
import {
  Nav,
  NavbarToggler,
  NavbarBrand
} from 'reactstrap';
import HeaderDropdown from './HeaderDropdown';

class Header extends Component {

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }

  render() {
    return (
      <header className="app-header navbar">
        <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler>
        <NavbarBrand href="#">
            <h5 className="navbar-brand-minimized">LSDS</h5>
            <h5 className="navbar-brand-full">Lost Stolen Device Subsystem</h5>
        </NavbarBrand>
        <NavbarToggler className="d-none" onClick={this.sidebarToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler>
        <Nav className="ml-auto" navbar>
          {/*<HeaderLanguageDropdown {...this.props} switchLanguage={this.props.switchLanguage} />*/}
          <HeaderDropdown {...this.props}/>
        </Nav>
        {/*<NavbarToggler className="d-md-down-none" onClick={this.asideToggle}>*/}
          {/*<span className="navbar-toggler-icon"></span>*/}
        {/*</NavbarToggler>*/}
      </header>
    );
  }
}

export default Header;
