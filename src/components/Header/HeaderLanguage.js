import React, {Component} from 'react';
import settings from './../../settings';
import i18n from './../../i18n';


class HeaderLanguage extends Component {
  render() {
    const { defaultLanguage } = settings.appDetails;
    return (
      <li className="nav-item">
        <div className="lang">
        {i18n.t('language')}:<span>{defaultLanguage}</span>
        </div>
      </li>
    );
  }
}

export default HeaderLanguage;
