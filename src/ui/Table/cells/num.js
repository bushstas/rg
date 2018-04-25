import React from 'react'

export default function NumberCell(data, key, table) {
	return (
		<td className="cell number-cell" key={key}>
	   		№{data.title[0]}
	   		<br/>
	   		от {data.title[1]}
		</td>
	)
}