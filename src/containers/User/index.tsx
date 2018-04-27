import * as React from "react";
import Store from "xstore";
import {IConnectedComponent, ILoginFormData} from '../../models';
import Loader from "../../ui/Loader";
import LoginForm from "../../forms/LoginForm";

interface IProps extends IConnectedComponent {
	token: string;
}

class User extends React.Component<IProps, {}> {
	componentDidMount() {
		if (this.props.token) {
			this.props.doAction('USER_LOAD');
		}
	}

	render() {
		return !this.props.token ? this.loginForm : this.loader;		
	}

	get loginForm() {
		return (
			<LoginForm 
				onSubmit={this.handleLoginFormSubmit}
			/>
		)
	}

	get loader() {
		const {fetching, children} = this.props;
		return (
			<Loader 
				classes="self"
				fetching={fetching}
			>
				{children}
			</Loader>
		)
	}

	handleLoginFormSubmit = (formData: ILoginFormData) => {
		this.props.doAction('USER_LOGIN', formData);
	}
}

export default Store.connect(User, 'user');