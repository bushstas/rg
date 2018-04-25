import React from 'react'

export default function RegdataCell(data, key, table, id) {
	return (
		<td className="cell regdata-cell" key={key}>
			ЗН ФН: {data.title[0]}<br/>
			ЗН К: {data.title[1]}
		</td>
	)
}