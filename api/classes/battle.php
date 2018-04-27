<?php

class Battle {
	static function load() {
		success(self::get());
	}

	private static function get() {
		return array(
			'enemies' => array(
				array('name' => 'Skeleton', 'type' => 'undead', 'img' => 'fj49urfhs', 'id' => 3, 'key' => '232323'),
				array('name' => 'Zombie', 'type' => 'undead', 'img' => 'rhhr4834f', 'id' => 2, 'key' => '55464')
			)
		);
	}
}