import React from 'react'
import Button from 'app/ui/Button'

export default function ActionsCell(data, key, table, id) {	
	let handleClick = function(action, id) {
		table.handleActionButtonClick(action, id);
	};
	return (
		<td className="cell action-cell" key={key}>
			<div className="edit" onClick={handleClick.bind(null, 'edit', id)}/>
		   	<div className="remove" onClick={handleClick.bind(null, 'remove', id)}/>			
		</td>
	)
}