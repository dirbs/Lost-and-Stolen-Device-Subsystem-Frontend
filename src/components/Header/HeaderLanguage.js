import React, {Component} from 'react';
import settings from './../../settings';


class HeaderLanguage extends Component {
  render() {
    const { defaultLanguage } = settings.appDetails;
    return (
      <li className="nav-item">
        <div className="lang">
          Language:<span>{defaultLanguage}</span>
        </div>
      </li>
    );
  }
}

export default HeaderLanguage;
