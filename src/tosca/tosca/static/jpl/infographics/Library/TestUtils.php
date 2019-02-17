<?php
class TestDebug
{
	public static function prep() {
		print('<link href="css/test.css" rel="stylesheet" type="text/css" media="screen, projection" />');
		print('<SCRIPT LANGUAGE="JavaScript" SRC="scripts/test.js"></SCRIPT>');
	}
	public static function start($text, $close=false) {
		print('<div class="test_results_header">'.$text);
		if ($close) { print('</div>'); }
	}
	public static function trace($text) {
		print('<div class="test_results_data">'.$text.'</div>');
	}
	public static function pre($text) {
		print('<pre class="test_results_data">'.$text.'</pre>');
	}
	public static function end() {
		print('</div>');
	}

	# Surround other outputs
	public static function startTrace() {
		print('<div class="test_results_data">');
	}
	public static function endTrace() {
		print('</div>');
	}
	public static function startPre() {
		print('<pre class="test_results_data">');
	}
	public static function endPre() {
		print('</pre>');
	}

	# Alias Methods
	public static function traceHeader($text) {
		TestDebug::start($text,true);
	}
}
class Debug extends TestDebug {}
?>