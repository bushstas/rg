import React from 'react'
import Checkbox from 'app/ui/Checkbox'

export default function CheckboxCell(data, key, table, id) {
	let handler = table.handleCheck.bind(table);
	return (
		<td className="cell checkbox-cell" key={key}>
		   	<Checkbox name={id} onChange={handler}/>
		</td>
	)
}