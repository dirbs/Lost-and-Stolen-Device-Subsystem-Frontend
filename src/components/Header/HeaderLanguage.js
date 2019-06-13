import React, {Component} from 'react';
import settings from './../../settings';


class HeaderLanguage extends Component {
  render() {
    const { defaultLanguage } = settings.appDetails;
    return (
      <div>
      Language:  
      <span className="h6">
       {defaultLanguage}
      </span>
      </div>
    );
  }
}

export default HeaderLanguage;
