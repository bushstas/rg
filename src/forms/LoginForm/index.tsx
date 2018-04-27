import * as React from "react";
import {IComponent, IFormProps, IFormState, ILoginFormData} from '../../models';
import Form from '../../ui/Form';
import Dialog from '../../ui/Dialog';
import FormField from '../../ui/FormField';
import FormSubmit from '../../ui/FormSubmit';
import Input from '../../ui/Input';

export default class LoginForm extends React.Component<IFormProps, IFormState> {
	state: IFormState = {
		data: {
			login: '',
			password: ''
		}
	}

	render() {
		const {data} = this.state;
		const {onSubmit} = this.props;

		return (
			<Dialog title="Login Form">
				<Form 
					classes="self"
					onChange={this.handleChange}
					onSubmit={onSubmit}
				>
					<FormField caption="Login">
						<Input
							name="login"
							value={data.login}
						/>
					</FormField>

					<FormField caption="Password">
						<Input
							name="password"
							type="password"
							value={data.password}
						/>
					</FormField>
					<FormSubmit>
						Submit
					</FormSubmit>
				</Form>
			</Dialog>
		)
	}

	handleChange = (data: ILoginFormData) => {
		this.setState({data});
	}
}