<?php

class Battle {
	static function load() {
		success(self::get());
	}

	private static function get() {
		requireClass('Hero');
		$path = 'data/'.TOKEN.'/battle.json';
		if (!file_exists($path)) {
			$enemies = self::generateEnemies(
				array(
					'quantity' => array(2, 5),
					'types' => array('undead'),
					'level' => array(1, 2)
				)
			);
			$data = array(
				'enemies' => $enemies,
				'heroCondition' => Hero::getCondition(),
				'active' => true
			);
			file_put_contents($path, json_encode($data));
		} else {
			$data = json_decode(file_get_contents($path), true);
		}
		
		return $data;
	}

	private static function generateEnemies($data) {
		$quantity = getNumber($data['quantity']);
		$enemies = array();
		for ($i = 0; $i < $quantity; $i++) {
			$enemies[] = self::generateEnemy($data['level'], $data['types']);
		}
		return $enemies;
	}

	private static function generateEnemy($level, $types = null) {
		$level = getNumber($level);
		if (empty($types)) {
			$types = Monsters::getTypes();
		}
		$type = getRandomItem($types);
		$monsters = Monsters::getAllOfTypeAndLevel($type, $level);
		$monster = getRandomItem($monsters);
		$monster['key'] = generateKey();
		$monster['type'] = $type;
		
		return $monster;
	}
}