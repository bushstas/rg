<?php

class Travel {
	static function load() {
		success(self::get());
	}

	private static function get() {
		$path = 'data/'.TOKEN.'/travel.json';
		
		if (true || !file_exists($path)) {
			$cards = self::generateCards(
				array(
					'quantity' => array(2, 5)
				)
			);
			$data = array(
				'cards' => $cards
			);
			file_put_contents($path, json_encode($data));
		} else {
			$data = json_decode(file_get_contents($path), true);
		}
		
		return $data;
	}

	private static function generateCards($data) {
		$quantity = getNumber($data['quantity']);
		
		for ($i = 0; $i < $quantity; $i++) {
			$card = self::generateCard();
			$cards[] = $card;
		}
		return $cards;
	}

	private static function generateCard() {
		$types = Cards::getTypes();
		$type = getRandomItem($types);

		$card = array(
			'type' => $type,
			'key' => generateKey()

		);

		
		return $card;
	}
}