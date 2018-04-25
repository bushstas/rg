import {autobind} from 'core-decorators'
import React from 'react'
import Popuper from 'app/services/Popuper'
import Dictionary from 'app/services/Dictionary'
import Component from 'app/ui/Component'

import "./style.scss"

const EMPTY_OPTION = 'Загрузка...';

export default class Select extends Component {
    constructor(props) {
        super();
        this.currentSource = '';
        this.initOptions(props);
        this.mounted = false;
    }

    componentWillReceiveProps(props) {
        let {source, parent} = props;
        if (source) {
            source = source + (!!parent ? parent : '');
            if (source != this.currentSource)  {
                this.initOptions(props);
                this.currentSource = source;
            }
        }
    }

    componentWillMount() {
       this.mounted = true; 
    }

    componentDidMount() {
        if (this.delayedEvents) {
            this.fireEvent('set', this.state.options);
        }
    }

    initOptions(props) {
        let options = props.options;
        if (!options) {
            options = [{
                value: '',
                title: EMPTY_OPTION
            }];
        }
        this.addToState({
            options: options
        });
        let {dict, source, parent} = props;
        if (dict) {
            let o = Dictionary.get(dict, this.setOptions);
            if (o) {
                this.delayedEvents = true;
            }
        } else if (source) {
            Dictionary.getBySource(source, parent, this.setOptions);
        }
    }

    render() {
        let {name, value, clearButton, readOnly, inactive, options, error} = this.props;
        let {active} = this.state;
        let title = this.getOptionTitle(value);
        let isEmptyValue = !value && this.hasProp('caption');

        if (!(options instanceof Array)) {
            options = this.state.options;
        }
        return (
            <div className={this.getClasses('input select', active ? 'active' : '', isEmptyValue ? 'empty' : '', clearButton ? 'clearable' : '', readOnly ? 'read-only' : '', inactive ? 'inactive' : '', error ? 'invalid' : '')} onClick={this.onClick}>
                <span className={this.mergeClasses('select-value', isEmptyValue ? 'empty-value' : '')}>
                    {title}
                </span>
                <input 
                    className={isEmptyValue ? 'empty-value' : ''}
                    ref="input"
                    type="text" 
                    name={name}
                    value={title}
                    onInput={this.onInput}
                    readOnly={!this.props.url}
                />
                {((options instanceof Array && options[0]) || isEmptyValue) && <div className="options" onClick={this.onOptionsClick}>
                    {this.renderEmptyOption()}
                    {options.map(this.renderItem)}
                </div>}
                {clearButton && <span className="clear" onClick={this.handleClear}/>}
                {error && <div className="error">{error}</div>}
            </div>
        )
    }

    renderEmptyOption() {
        let {caption} = this.props;
        if (caption) {
            return (
                <div className="option empty-option" key='-1' data-index={-1} data-value="">
                    {caption}
                </div>
            )
        }
    }

    @autobind
    renderItem(item, i) {
        let {value} = item;
        let currentValue = this.getProp('value');
        return (
            <div className={this.mergeClasses('option', currentValue == value ? 'active' : '', item.class)} key={i} data-index={i} data-value={value}>
                {item.title}
            </div>
        )
    }

    hide() {
         this.setState({
            active: false
        });
    }

    @autobind
    handleClear(e) {
        e.stopPropagation();
        this.fireEvent('change', this.getProp('name'), '');
    }

    @autobind
    onClick() {
        if (!this.hasProp('readOnly')) {
            this.setState({
                active: true
            });
            Popuper.watch(this);
        }
    }
    
    @autobind
    onOptionsClick(e) {
        e.stopPropagation();
        let value = this.getTargetData(e, 'option', 'value');
        if (typeof value != 'undefined') {
            this.handleChange(value, true);
        }
    }

    @autobind
    onInput(e) {
        
    }

    @autobind
    setOptions(options) {
        var value = '';
        if (options instanceof Array) {
            value = this.getProp('value');
            if (value) {
                let found;
                for (let i = 0; i < options.length; i++) {
                    if (value == options[i].value) {
                        found = true;
                        break;
                    }
                }
                if (!found) value = '';
            }
            if (!value && !this.hasProp('caption')) {
                if (options[0] instanceof Object) {
                    value = options[0].value;
                } else {
                    value = options[0];
                }
            }
            if (this.mounted) {
                this.setState({
                    options: options
                });
            } else {
                this.addToState({
                   options: options 
                });
            }
        }
        this.fireEvent('set', options);
        this.handleChange(value);
    }

    handleChange(value, byUser) {
        this.fireEvent('change', this.getProp('name'), value, byUser);
    }

    getOptionTitle(value) {
        let {options} = this.props;
        if (!(options instanceof Array)) {
            options = this.state.options;
        }        
        if (options instanceof Array) {
            for (let i = 0; i < options.length; i++) {                
                if (options[i] instanceof Object) {
                    if (value == options[i].value) {
                        return options[i].small || options[i].title || options[i].value;
                    }
                } else {
                    if (value == options[i]) {
                        return options[i];
                    }
                }
            }
            if (this.hasProp('caption')) {
                return this.getProp('caption');
            }
            if (this.hasProp('empty')) {
                return this.getProp('empty');
            }
            if (options[0] instanceof Object) {
                return options[0].small || options[0].title || options[0].value;
            } else {
                return options[0];
            }
        }
    }
}