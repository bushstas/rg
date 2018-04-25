import React from 'react'
import Router from 'app/services/Router'

export default function NameCell(data, key, table, id) {
	return (
		<td className="cell name-cell" key={key}>
		   	<a href={Router.getLink('org', {id: id})} target="_blank">
		   		{data.title}
		   	</a>
		</td>
	)
}