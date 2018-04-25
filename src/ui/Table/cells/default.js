import React from 'react'
import Tooltip from 'app/ui/Tooltip'

export default function DefaultCell(data, key, table) {
	return (
		<td className="cell default-cell" key={key}>
		   	{data.title}
		   	{data.tooltip && <Tooltip>{data.tooltip}</Tooltip>}
		</td>
	)
}