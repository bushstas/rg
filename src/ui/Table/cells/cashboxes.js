import React from 'react'

export default function CashboxesCell(data, key, table, id) {	
	let {active, notpayed, registering, close} = data;
	return (
		<td className="cell contracts-cell" key={key}>
			{active && active !== '0' && <div className="active">Подключено: {active}</div>}
			{notpayed && notpayed !== '0' && <div className="notpayed">Не оплачено: {notpayed}</div>}
			{registering && registering !== '0' && <div className="registering">На регистрации: {registering}</div>}
			{close && close !== '0' && <div className="close">Отключено: {close}</div>}
		</td>
	)
}