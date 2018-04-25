import React from 'react'

export default function ContractsCell(data, key, table, id) {	
	let {active, notsigned, expired, close} = data;
	return (
		<td className="cell contracts-cell" key={key}>
			{active && active !== '0' && <div className="active">Действующие: {active}</div>}
			{notsigned && notsigned !== '0' && <div className="notsigned">Не подписанные: {notsigned}</div>}
			{expired && expired !== '0' && <div className="expired">Истекшие: {expired}</div>}
			{close && close !== '0' && <div className="close">Расторгнутые: {close}</div>}
		</td>
	)
}