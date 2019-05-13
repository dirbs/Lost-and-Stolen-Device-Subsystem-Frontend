import React from 'react';
import i18n from './../../i18n';

export default function DashboardInstructions() {
    return (
        <div>
            <ul className="instructions">
                <li>{i18n.t('dashboard.instructions.li1')}</li>
                <li>{i18n.t('dashboard.instructions.li2')}</li>
                <li>{i18n.t('dashboard.instructions.li3')}</li>
                <li>{i18n.t('dashboard.instructions.li4')}</li>
                <li>{i18n.t('dashboard.instructions.li5')}</li>
                <li>{i18n.t('dashboard.instructions.li6')}</li>
            </ul>
        </div>
    )
}
