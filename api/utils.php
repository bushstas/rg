<?php

function requireClass() {
	$numargs = func_num_args();
	$arg_list = func_get_args();
    for ($i = 0; $i < $numargs; $i++) {
        if (!class_exists($arg_list[$i])) {
        	require_once __DIR__.'/classes/'.ucfirst($arg_list[$i]).'.php';
        }
    }
}

function error($error) {
	$data = array('success' => false, 'error' => $error);
	die(json_encode($data));
}

function success($data) {
	$data = array('success' => true, 'body' => $data);
	die(json_encode($data));
}

function getNumber($n, $defaultNumber = 1) {
	$number = $defaultNumber;
	if (is_numeric($n)) {
		$number = (int)$n;
	} elseif (is_array($n)) {
		if (is_numeric($n[0])) {
			$number = $n[0];
			if (is_numeric($n[1])) {
				$number = rand($number, (int)$n[1]);
			}
		}
	}
	return $number;
}

function generateKey($length = 10) {
	$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

function getRandomItem($items) {
	$idx = array_rand($items);
	return $items[$idx];
}