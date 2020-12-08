import React, { Component } from 'react';
import i18n from './../../i18n';

export default class RenderWarningPopup extends Component {

    constructor(props) {
        super(props)
        this.yes = this.yes.bind(this)
        this.no = this.no.bind(this)

        this.state = {
            hidden: false
        }

        document.body.classList.add('popup-show');
    }

    yes() {
        this.props.callback(true)
        this.setState({ hidden: true })
        window.location.reload()
    }

    no() {
        this.props.callback(false)
        this.setState({ hidden: true })
    }

    componentWillReceiveProps() {
        document.body.classList.add('popup-show');
        this.setState({ hidden: false })
    }

    render() {
        if (this.state.hidden) {
            document.body.classList.remove('popup-show');
            return null
        }
        return (
            <div className='holder'>
                <div className='popup'>

                    <div className="popup-icon popup-question"></div>
                    {/*<div className="popup-icon popup-error">*/}
                        {/*<span className="popup-x-mark">*/}
                            {/*<span className="popup-x-mark-line-left"></span>*/}
                            {/*<span className="popup-x-mark-line-right"></span>*/}
                        {/*</span>*/}
                    {/*</div>*/}

                    <h2 className="popup-title">
                        <p>{i18n.t('alert.warning')}</p>
                    </h2>

                    <div className="popup-content">
                        <div>{this.props.message}</div>
                    </div>

                    <div className="popup-actions">
                        <button type="button" onClick={this.yes} className="popup-confirm">{i18n.t('button.leave')}</button>
                        <button type="button" onClick={this.no} className="popup-cancel">{i18n.t('button.cancel')}</button>
                    </div>
                </div>
            </div>
        )
    }
}