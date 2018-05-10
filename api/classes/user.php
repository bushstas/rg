<?php

class User {
	static function login() {
		$login = $_POST['login'];
		$password = md5($_POST['password']);

		$user = self::get();
		$user['token'] = $password;
		success($user);
	}

	static function load() {
		success(self::get());
	}

	private static function get() {
		return array(
			'location' => 'travel'
		);
	}
}