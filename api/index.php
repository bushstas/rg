<?php

include 'utils.php';

$action = $_GET['action'];
$parts = explode('_', $action);
if (is_string($parts[1]) && file_exists('classes/'.$parts[1].'.php')) {
	include_once 'classes/'.$parts[1].'.php';
	$class = ucfirst($parts[1]);
	$method = $parts[0];
	if (class_exists($class) && method_exists($class, $method)) {
		$class::$method();
	}
}
error('Some error');