import React, { Component } from 'react';
import i18n from './../../i18n';
import { translate, Trans, I18n } from 'react-i18next';

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <I18n ns="translations">
        {
          (t, { i18n }) => (
            <div className="animated fadeIn">
              <h2>{t('dashboardLink')}</h2>
            </div>
          )
        }
        </I18n>
    )
  }
}

export default translate('translations')(Dashboard);
