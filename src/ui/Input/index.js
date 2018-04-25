import {autobind} from 'core-decorators'
import React from 'react'
import Component from 'app/ui/Component'
import Validator from 'app/services/Validator'
import Router from 'app/services/Router'
import AjaxRequest from 'app/services/AjaxRequest'
import Tooltip from 'app/ui/Tooltip'
import {ERRORS, REQUIRED_ERRORS, AC_ERRORS} from 'app/consts/errors.js'

import "./style.scss"

export default class Input extends Component {
    render() {
        let isCustomError = this.hasProp('error');
        let showError = this.hasProp('showError');
        let isError = !!showError && (this.hasState('error') || isCustomError);
        let isValid = !isError && this.hasState('valid');        
        let inactive = this.getProp('inactive');
        let readOnly = inactive || this.getProp('readOnly');
        let value = this.getProp('value');
        if ((!value && !this.hasProp('required')) || this.hasProp('novalidation')) {
            isValid = false;
        }
        if (this.hasProp('autocomplete') && !this.hasState('acId')) {
            isValid = false;
            if (showError) isError = true;
        }
        return (
            <div className={this.getClasses('input', isCustomError || isError ? 'invalid' : '', !isCustomError && isValid ? 'valid' : '', readOnly ? 'read-only' : '', !value ? 'empty' : '', inactive ? 'inactive' : '', this.hasState('focused') ? 'focused' : '')}>
                {this.renderControl()}
                {this.renderLengthIndicator()}
                {showError && this.renderError()}
                {!this.hasProp('noClear') && <span className="clear" onClick={this.handleClear}/>}
                {this.hasProp('autocomplete') && this.renderAC()}
            </div>
        )
    }

    componentWillReceiveProps(props) {
        let validator = this.getProp('validator');
        let value = this.getProp('value');
        if (validator != props.validator || value != props.value) {
            this.validate(props.value, props);
        }
    }

    componentDidMount() {
        this.validate(this.props.value, this.props);
    }

    componentWillUnmount() {
        this.fireEvent('validate', true, this.props.name, this.props.value);
    }

    renderAC() {
        return <div className="autocomplete" onMouseDown={this.handleACClick}>
            {this.mapState('acOptions', this.renderACOption)}
        </div>
    }

    @autobind
    handleACClick(e) {
        var id = this.getTargetData(e, 'autocomplete-option', 'id');
        var value = this.getTargetData(e, 'autocomplete-option', 'value');
        if (id && value) {
            let same = this.refs.input.value == value;
            this.refs.input.value = value;
            this.state.acId = id;
            this.state.focused = false;
            this.handleChange();
            if (same) {
                this.validate(value, this.props);
            }
            this.fireEvent('pick', id);
        }
    }

    @autobind
    renderACOption(item) {
        return <div className="autocomplete-option" data-id={item.id} data-value={item.name} key={item.id}>
            {item.name}
        </div>
    }

    renderControl() {
        let {
            isTextarea,
            name,
            type = 'text',
            readOnly,
            value,
            placeholder,
            maxLength,
            disabled,
            inactive,
            noac
        } = this.props;
      
        let props = {
            ref: 'input',
            name: name,
            value: value || '',
            readOnly: readOnly || inactive,
            placeholder: placeholder,
            disabled: disabled,
            onChange: this.onChange,
            onFocus: this.onFocus,
            onBlur: this.onBlur,
            onPaste: this.onChange
        };
        if (noac) {
            props.autoComplete = 'off';
        }
        if (maxLength) {
            props.maxLength = maxLength;
        }
        if (!isTextarea) {
            props.type = type;
            return <input {...props}/>
        } else {
            return <textarea {...props}/>
        }
    }

    renderLengthIndicator() {
        let {maxLength, indicator} = this.props;
        if (indicator && typeof maxLength == 'number') {
            let {value = ''} = this.props;
            if (!value) value = '';
            let len = value.length;
            return (
                <div className="input-length-indicator">
                    {len} / {maxLength}
                </div>
            )
        }
    }

    renderError() {
        let name = this.getProp('name');
        let err = this.getProp('error');
        let reqError = this.getProp('reqError');
        let error = this.getState('error');
        let validator = this.getProp('validator');
        let hasIndicator = this.hasProp('indicator');
        let ac_error;
        if (this.hasProp('autocomplete') && !this.hasState('acId')) {
            ac_error = AC_ERRORS[name];
        }
        if (err || error || reqError || ac_error) {
            if (!ac_error) {
                if (typeof reqError == 'string') { 
                    error = REQUIRED_ERRORS[reqError];
                } else if (typeof err == 'string') {
                    error = ERRORS[err];
                } else if (err) {
                    error = REQUIRED_ERRORS[name];
                } else {
                    error = ERRORS[validator];
                }
            } else {
                error = ac_error;
            }
            return (
                <div className={this.mergeClasses('input-bottom-error', hasIndicator ? 'absolute' : '')}>
                    {error}
                </div>
            )
        }
    }

    renderItem(item, i) {
        return (
            <span key={i}>
                {item}
            </span>
        )
    }

    @autobind
    onChange() {
        if (this.hasProp('autocomplete') && this.state.acId) {
            this.state.acId = '';
            this.fireEvent('reset');
        }
        this.handleChange();
    }

    getInput() {
        return this.refs.input;
    }

    resetAC() {
        this.setState({acId: '', acOptions: []});
    }

    handleChange() {
        let input = this.getInput();
        let {value} = input;
        let {validator, name} = this.props;
        if (validator) {
			value = Validator.correct(value, validator);
        }
        this.fireEvent('change', name, value);
        if (this.hasProp('autocomplete')) {
            window.clearTimeout(this.timer);
            if (value.length > 2) {
                let url = Router.getACLink(this.props.autocomplete);
                if (url) {
                    this.timer = window.setTimeout(this.loadAC.bind(this, url, value), 400);
                }
            } else {
                this.setState({acOptions: [], focused: false});
            }
        } else if (this.hasState('error') || !value) {
            this.validate(value, this.props);
        }
    }

    loadAC(url, value) {
        AjaxRequest.send(url, 'GET', {text: value, parent: this.getProp('parent')}, this.handleACLoad);
    }

    @autobind
    handleACLoad(data) {
        this.setState({'acOptions': data, focused: data.length > 0});
    }

    @autobind
    onFocus(e) {
        if (this.props.handleFocus instanceof Function) {
            this.props.handleFocus(this.props.value);
        }
        this.fireEvent('focus', this.props.value);
        if (this.hasProp('autocomplete') && this.hasState('acOptions')) {
            let {acOptions} = this.state;
            if (acOptions.length > 1 || (!this.hasState('acId') && this.props.value && this.props.value.length > 2)) {
                this.setState({'focused': true});
            }
        }        
    }

    @autobind
    onBlur(e) {
        if (this.timer) window.clearTimeout(this.timer);
        this.fireEvent('blur', this.props.value);
        this.setState({'focused': false});
    }

    validate(value, props) {
        let {validator, required, name, autocomplete} = props;
        let acId = this.getState('acId');
        let error;
        if (validator) {
        	error = !!Validator.validate(value, validator);
        }
        let valid = true;
        if (autocomplete && !acId) {
            valid = false;
        }
        if (error || (required && !value)) {
            valid = false;
        }
        this.setState({
            error: error ? 1 : false,
            valid: valid && value
        });
        this.fireEvent('validate', valid, name, value);
    }

    @autobind
    handleClear(e) {
        e.stopPropagation();
        let input = this.getInput();
        input.value = '';
        this.handleChange();
        this.fireEvent('clear');
    }
}