import React from 'react'

export default function RequisitesCell(data, key, table, id) {	
	let {inn, kpp, ogrn} = data.title;
	return (
		<td className="cell requisites-cell" key={key}>
			<div>ИНН: {inn}</div>
			<div>КПП: {kpp}</div>
			<div>ОГРН: {ogrn}</div>
		</td>
	)
}