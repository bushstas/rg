import React from 'react'
import Router from 'app/services/Router'

export default function ClientIDCell(data, key, table, id) {
	return (
		<td className="cell client-id-cell" key={key}>
		   	<a href={Router.getLink('client', {id: data.title})} target="_blank">
		   		{data.title}
		   	</a>
		</td>
	)
}