import {autobind} from "core-decorators"
import React from 'react'
import Component from 'app/ui/Component'
import Tooltip from 'app/ui/Tooltip'

import "./style.scss"

export default class Form extends Component {
    constructor(props) {
        super();
        props = props || {};
        let data = {
             ...this.getDefaultData(props),
             ...props.defaultData
        };
        if (props.data instanceof Object) {
            for (let k in props.data) {
                if (props.data[k] || !data[k]) {
                    data[k] = props.data[k];
                }
            }
        }
        this.addToState({
            data: data,
            invalids: [],
            isValid: true,
            emptyErrorsShown: false
        });
        this.controlsList = {};
    }

    render() {
        let cb = this.getProp('clearButton');
        return (
            <div ref="scope" className={this.getClasses('form')}>
                <div className="form-content">
                    {!this.hasState('noClearButton') && cb && this.renderClearButton()}
                    {this.renderBeforeContent()}
                    {this.renderInputControls()}
                    {this.renderButtonControls()}
                </div>
            </div>
        )
    }

    renderInputControls() {
        let controls = this.getInputControls();        
        if (controls instanceof Array) {
            return (
                <div className="form-input-controls">
                    {controls.map(this.renderFormField)}
                </div>
            )
        }
    }

    renderFormArea(control, i) {
        let {area, controls} = control;
        return (
            <div className={this.mergeClasses('form-area', area)} key={i}>
                <div className="form-area-inner">
                    {controls.map(this.renderFormField)}
                </div>
            </div>
        )
    }

    @autobind
    renderFormField(control, i) {
        let {emptyErrorsShown} = this.state;
        let errorClasses;
        if (control && control instanceof Object) {
            if (control.area) {
                return this.renderFormArea(control, i);
            }
            if (control.element) {
                return React.cloneElement(control.element, {key: i});
            }
            let {component, before, after, classes, caption, tooltip, error, required, value, name, handler} = control;
            let props = {
                handleChange: !!handler ? null : this.handleControlChange,
                onValidate: this.handleValidation,
                handleFocus: component.props.onFocus,
                onFocus: this.handleFocus
            };
            if (component.props.name) {
                props.ref = component.props.name + '_control';
                this.controlsList[component.props.name] = true;
            }
            let c = 'form-field';
            if (classes) {
                c += ' ' + classes;
            }
            if (emptyErrorsShown && component.props) {
                let {required, value, requiredError} = component.props;
                if (required && !value) {
                    props.error = requiredError || true;
                    props.reqError = requiredError;
                }
                props.showError = true;
            }
            return (
                <div className={c} key={i}>
                    {before}
                    {this.renderFieldCaption(caption, tooltip)}
                    {React.cloneElement(component, props)}
                    {after}
                </div>
            )
        }
    }

    renderFieldCaption(caption, tooltip) {
        if (caption) {
            if (typeof tooltip == 'string' && !!tooltip) {
                tooltip = <Tooltip name={tooltip}/>
            }
            return (
                <div className="field-caption">
                    {caption}
                    {tooltip}
                </div>
            )
        }
    }

    renderButtonControls() {
        let controls = this.getButtonControls();
        if (controls instanceof Array && typeof controls[0] != 'undefined') {
            return (
                <div className="form-button-controls">
                    {controls.map(this.renderButton)}
                </div>
            )
        }
    }

    renderButton(button, i) {
        if (!button) return;
        return (
            <span className="form-button" key={i}>
                {button}
            </span>
        );
    }

    renderClearButton() {
        return (
            <div className="form-clear-button" onClick={this.clear}>
                Очистить
            </div>
        )
    }

    @autobind
    submit() {
        let data = this.getData();
        let properData = {};
        for (let k in data) {
            if (data[k] !== undefined && data[k] !== null) {
                properData[k] = data[k];
            }
        }
        if (this.isValid()) {
            this.fireEvent('submit', properData);
        }
        this.onSubmitted(properData);
    }

    isValid() {
        let {isValid} = this.state;
        return isValid && this.state.invalids.isEmpty();
    }

    getInvalids() {
        return this.state.invalids;
    }

    getData() {
        return this.state.data;
    }

    setData(dataToSet, props) {
        let {data} = this.state;
        for (let k in dataToSet) {
            if (!!dataToSet[k] || dataToSet[k] === 0 || dataToSet[k] === '0' || dataToSet[k] === false || dataToSet[k] === '') {
                data[k] = dataToSet[k]; 
            }
        }
        this.setState({
            data: data,
            ...props
        });
    }

    @autobind
    handleControlChange(name, value) {
        let {data} = this.state;
        let newState;
        newState = this.onChanged(name, value, data);
        if (newState instanceof Object) {
            if (newState.data instanceof Object) {
                for (let k in newState.data) {
                    data[k] = newState.data[k];
                }
            }
            newState.data = data;
        } else {
            newState = {data};
        }
        if (name instanceof Object) {
            for (var k in name) {
                newState.data[k] = name[k];
            }
        } else {
            newState.data[name] = value;
        }
        this.setState(newState);
        this.fireEvent('change', name, value);
        this.onAfterChanged(data);
    }

    @autobind
    handleValidation(isValid, name, value) {
        let {invalids} = this.state;
        invalids.addRemove(name, !isValid, true);
        this.setState({
            invalids: invalids
        });
        this.fireEvent('validate', this.isValid());
    }

    @autobind
    handleFocus() {
        this.fireEvent('focus');
    }

    @autobind
    clear() {
        let newData = {
            ...this.getDefaultData(),
            ...this.getProp('defaultData')
        };
        let {data} = this.state;
        for (let k in data) {
            if (this.controlsList[k]) {
                data[k] = newData[k];
            }
        }
        this.onClear(data);
        this.fireEvent('clear', data);        
    }

    getDefaultData() {
        return {}
    }

    onClear(data) {
        this.setState({
            data: data
        });
    }

    @autobind
    handleDisabledSubmit() {
        var invalids = this.getInvalids();
        this.setState({
            emptyErrorsShown: invalids.length > 0
        });
    }

    isSubmitted() {
        return this.hasState('emptyErrorsShown') && !this.isValid();
    }

    renderBeforeContent() {}
    onSubmitted() {}
    onChanged() {}
    getInputControls() {}
    getButtonControls() {}
    onAfterChanged() {}
}