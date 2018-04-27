import * as React from 'react';
import Icon from '../Icon';
import {dict} from '../../utils/Dictionary';
import {IComponent} from '../../models';

interface IProps extends IComponent {
	onClose?: (name: string) => void;
	title?: JSX.Element | string;
	name?: string;
	clickMaskToClose?: boolean;
}


export default class Dialog extends React.Component<IProps, {}> {
	static defaultProps = {
		onClose: () => {}
	}

	render() {
		let {children, classes, title} = this.props;
		return (
			<div className="box $classes">
				<div className="mask" onClick={this.handleMaskClick}/>
				<div className="self">
					<div className="title">
						{title}
						<Icon 
							icon="close" 
							onClick={this.handleClose}
							classes="close"
						/>
					</div>
					<div className="content">
						{children}
					</div>
				</div>
			</div>
		)
	}

	handleClose = (e = null) => {
		if (e) {
			e.stopPropagation();
		}
		this.props.onClose(this.props.name);
	}

	handleMaskClick = (e) => {
		e.stopPropagation();
		let {clickMaskToClose} = this.props;
		if (clickMaskToClose) {
			this.handleClose(e);
		}
	}

}