import * as React from 'react';

interface IProps {
	type: string;
	id: string;
}

export default function CreatureImage({type, id}: IProps) {
	const path = '/pictures/' + type + '/' + id + '.png';
	const style = {backgroundImage: 'url(' + path + ')'};
	return (
		<div className="self" style={style}/>
	)	
}