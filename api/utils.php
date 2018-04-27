<?php

function error($error) {
	$data = array('success' => false, 'error' => $error);
	die(json_encode($data));
}

function success($data) {
	$data = array('success' => true, 'body' => $data);
	die(json_encode($data));
}