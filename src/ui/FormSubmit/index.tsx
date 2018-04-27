import * as React from 'react';
import Button from '../Button';
import {IComponent, IChildren} from '../../models';

export interface IFormSubmitProps extends IComponent {
	onClick?: (value: string) => void; 
}

export default function FormSubmit(props: IFormSubmitProps) {
	return <Button {...props}/>
}