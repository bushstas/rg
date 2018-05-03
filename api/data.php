<?php

class Monsters {
	private static $types = array(
		'undead',
		'animal',
		'demon',
		'human',
		'elemental'
	);

	static function getTypes() {
		return self::$types;
	}

	static function getAllOfType($type) {
		include 'monsters/'.$type.'.php';
		return $list;
	}

	static function getAllOfTypeAndLevel($type, $level) {
		$all = self::getAllOfType($type);
		$list = array();
		foreach ($all as $monster) {
			if ($monster['level'] == $level) {
				$list[] = $monster;
			}
		}
		return $list;
	}
}