import React from 'react'
import Router from 'app/services/Router'

export default function StatusCell(data, key, table) {
	let classes = 'status status' + data.key;
	return (
		<td className="cell status-cell" key={key}>
		   	<div className={classes}>
		   		{data.title}
		   	</div>
		</td>
	)
}