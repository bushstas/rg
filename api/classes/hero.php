<?php

class Hero {
	static function getCondition() {
		return array(
			'life' => array(20, 30),
			'mana' => array(4, 10),
			'stamina' => array(35, 60)
		);	
	}
}