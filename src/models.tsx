export type IChildren = JSX.Element[] | JSX.Element | string;

export interface IComponent {
	key?: string | number;
	classes?: string;
	children?: IChildren;
	disabled?: boolean;
}

export interface IConnectedComponent extends IComponent {
	fetching?: boolean;
	doAction: (action: string, props?: any) => {};
	dispatch: (action: string, props?: any) => {};
}

export interface ICheckboxItem {
	value: string;
	label: string;	
}

export interface ILoginFormData {
	login: string;
	password: string;
}

export type IFormData = ILoginFormData;

export interface IFormProps {
	onSubmit?: (formData: IFormData) => void;
}

export interface IFormState {
	data: IFormData;
}

export interface IEnemy {
	name: string;
	key: string;
	type: string;
	id: number;
	img: string;
	level: number;
}