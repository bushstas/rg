import React from 'react'

export default function OrderStatusCell(data, key, table) {
	let classes = 'status-content status' + data.key;
	return (
		<td className="cell order-status-cell" key={key}>
		   	<div className={classes}>
			   	{data.title}
			</div>
		</td>
	)
}