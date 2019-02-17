<?php

require_once("SaveableObject.php");

class User extends SaveableObject
{
	public $firstName = '';
	public $lastName = '';
	public $email = '';
	public $description = '';
	public $username = '';
	public $password = '';
	public $securityQ = '';
	public $securityA = '';
	public $isAdmin = '';
	public $emailSignup = ''; #yes or no

	public $dateCreated;
	
	protected static $tableName = 'si_users';
	protected static $dbClass = 'UserDatabase';
	
	/** Methods **/
	protected function setSaveableFields() 
	{
		$this->saveableFields = array(
			'firstName' => $this->firstName,
			'lastName' => $this->lastName,
			'email' => $this->email,
			'description' => $this->description,
			'username' => $this->username,
			'password' => $this->password,
			'securityQ' => $this->securityQ,
			'securityA' => $this->securityA,
			'emailSignup' => $this->emailSignup,
			'dateCreated' => $this->dateCreated
		);
	}


	#
	# Search Methods
	#
  public static function FindByEmailOrUsername($email, $username = NULL) {
  	$where = null;
  	if ($email != null || $username != null)
  	{
  		$where = "email = '". mysql_real_escape_string($email) ."' OR (username = '". mysql_real_escape_string($username) ."' AND username is not null AND username != '')";
  	}
  	return static::Find($where);
  }

  public static function FindForPasswordReset($firstName, $lastName, $email, $securityQ, $securityA) {
  	$where = null;
  	if ($firstName != null && $lastName != null && $email != null && $securityQ != null && $securityA != null)
  	{
  		$where = "firstName = '" . mysql_real_escape_string($firstName) . "' AND lastName = '" . mysql_real_escape_string($lastName) . "' AND email = '" . mysql_real_escape_string($email) . "' AND securityQ = '" . mysql_real_escape_string($securityQ) . "' AND securityA = '" . mysql_real_escape_string($securityA) . "'";
  	}
  	$results = static::Find($where);
  	if (count($results) == 1) 
  		return $results[0];
  	else
  		return null;
  }
 	#
	# Static Current User Methods
	#
	public static function displaySessionInfo()
	{
		echo("<pre>");
		print_r($_SESSION);
		echo("</pre>");
	}

	public static function logOutUser() { 
		$_SESSION['userID'] = NULL; 
		unset($_SESSION['userID']);
		$_SESSION['firstName'] = NULL; 
		unset($_SESSION['firstName']);
		$_SESSION['lastName'] = NULL; 
		unset($_SESSION['lastName']);
		$_SESSION['username'] = NULL; 
		unset($_SESSION['username']);
		$_SESSION['isAdmin'] = NULL; 
		unset($_SESSION['isAdmin']);
		$_SESSION['password'] = NULL; 
		unset($_SESSION['password']);		
		return true; 
	}
	public static function logInUser($user) { 
		self::logOutUser();
		$_SESSION['userID'] = $user->id;
		$_SESSION['email'] = $user->email;
		$_SESSION['firstName'] = $user->firstName;
		$_SESSION['lastName'] = $user->lastName;
		$_SESSION['username'] = $user->username;
		$_SESSION['isAdmin'] = $user->isAdmin;
		$_SESSION['password'] = $user->password;
		return true; 
	}

	public static function FindByUsername($username)
	{
		$results = self::Find("username = '" . mysql_real_escape_string($username) . "'");
		if (count($results) > 0)
			return $results[0];
		else
			return null;
	}

	public static function isLoggedIn() { 
		if (isset($_SESSION['userID']) && (int)$_SESSION['userID'] > 0) 
			return true; 
	}
	public static function isAdmin() { 
		if (isset($_SESSION['isAdmin']) && (int) $_SESSION['isAdmin'] == 1)
			return true;
	}
	public static function getUsername() { 
		if (isset($_SESSION['username']) && $_SESSION['username'] != '')
			return $_SESSION['username'];
		return null;
	}
	public static function getUsernameOrEmail() { 
		if (isset($_SESSION['username']) && $_SESSION['username'] != '')
			return $_SESSION['username'];
		else if (isset($_SESSION['email']) && $_SESSION['email'] != '')
			return $_SESSION['email'];
		else
			return 'Anonymous'; 
	}
	public static function getEmail() {
		if (isset($_SESSION['email']) && $_SESSION['email'] != '')
			return $_SESSION['email'];
		else
			return null; 
	}
	public static function getUserId() { 
		if (isset($_SESSION['userID']))
			return $_SESSION['userID'];
		else 
			return null; 
	}
	public static function setUsername($username) {
		$success = false;
		if ($username)
		{
			$user = static::getCurrentUser();
			if ($user->username == null || $user->username == '')
			{
				if (static::FindByUsername($username) == null)
				{
					$user->username = $username;
					$success = $user->save();
					if ($success) 
					{
						$_SESSION['username'] = $username;
						$message = 'Your new username is ' . $username;
					}
					else
					{
						$message = 'Failed to set username ' . $username;
					}
				}
				else
				{
					$message = 'Username '  . $username . ' already exists, please choose another';
					$success = false;
				}
			}
			else 	
			{
				$message = 'You already have a username!';
				$success = false;
			}
		}
		if (isset($message))
		{ 
			$_SESSION['message'] .= $message;
		}
		return $success;
	}

	public static function getCurrentUser() { 
		return self::Load(self::getUserId()); 
	}
}
?>