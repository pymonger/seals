<?php

require_once("Database.php");

class SaveableObject
{
	public $id;
	protected $saveableFields;
	
	public function xray()
	{	/*
		print('<hr>XRAY</hr><pre>');
		print_r(get_object_vars($this));
		print('</pre><hr>');
		*/
	}
	public function getNonNullSaveableFields()
	{
		if ($this->saveableFields == null) 
		{
			$this->setSaveableFields();
			$array = array();
			foreach($this->saveableFields as $key=>$value){
				if($value != null) $array[$key] = $value;
			}
			$this->saveableFields = $array;
		}
		return $this->saveableFields;
	}
	
	protected function setSaveableFields() 	# Override in subclass	
	{
		$this->saveableFields = array();
		#$saveableFields = array('createdDate' => $this->createdDate, 'modifiedDate' => $this->modifiedDate);
	}

	protected static $tableName; // 'infographics', 'users' etc.
	protected static $dbClass; // Database, UserDatabase, etc.

	# Get id or generate it by looking for next available id in db
	public function getId() 
	{
		if ($this->id != null) 
		{
			return $this->id;
		}
		else
		{
			return static::getNextId();
		}
	}

	public static function getNextId()
	{
		$db = new static::$dbClass();
		$db->connect();
		$idQuery = 'SELECT DISTINCT Auto_increment as id FROM information_schema.tables WHERE table_name="' . static::$tableName . '";';
		if ($db->dbSelect($idQuery))
		{
			$result = $db->getResult();
			return $result['id'];
		} 
		else
		{
			return '0';
		}
		$db->disconnect();
	}

	#
	# Save to db
	#
	public function save () 
	{

		if (static::$tableName != null)
		{
			if ($this->id != null) {
				# Update
				$db = new static::$dbClass();
				$db->connect(true);
				if ($db->update(static::$tableName, $this->getNonNullSaveableFields(), array('id',(int)$this->id)))
				{
					return $this->id;
				}
				else
				{
					return false;
				}
				$db->disconnect();
			} 
			else 
			{
				# Insert
				$idToReturn = $this->getId();

				$db = new static::$dbClass();
				$db->connect(true);
				#print('<pre>');
				#print_r($this->getNonNullSaveableFields());
				#print('</pre>');
				if ($db->insert(static::$tableName, array_values($this->getNonNullSaveableFields()), array_keys($this->getNonNullSaveableFields()))) 
				{
					if ($idToReturn) {
						return $idToReturn;
					} else { 
						return true;
					}
				} else { 
					return false;
				}
				$db->disconnect();
			}
		}
		return false;
	}

  #
  # SELECT METHODS
  #

	# Static method for loading a SINGLE data result for Object generation
	public static function Load($id) 
	{
    if (static::$tableName != null)
		{
			$id = (string)$id;
			$db = new static::$dbClass();
			$db->connect();

			if ($id != null) 
			{
				$query = 'SELECT DISTINCT * FROM ' . static::$tableName . ' WHERE id=' . $id . ';';
				if ($db->dbSelect($query))
				{
					$result = $db->getResult();
					if ($result)  
						return static::CreateFromArray($result);
					else 
						return $result; # empty array
				} 
				else 
				{
					return null;
				}
			}
			$db->disconnect();
		}
		return null;
  }

	# Static method for loading MULTIPLE data results for Object generation
  public static function Find($where = NULL, $orderBy = NULL, $limit = NULL, $limitStart = NULL, $query = NULL) 
  {	
  	if (static::$tableName != null)
		{
			$db = new static::$dbClass();
			$db->connect();

			if ($query == null) 
			{
				if ($where) { $where = ' WHERE ' . $where; }
				if ($orderBy) { $orderBy = ' ORDER BY ' . $orderBy; }
				if ($limit) { 
	        $limitString = ' LIMIT ';
	        if ($limitStart) { $limitString .= $limitStart . ', '; }
	        $limitString .= $limit;
	      } else {
	        $limitString = null;
	      }

				$query = 'SELECT * FROM ' . static::$tableName . $where . $orderBy . $limitString;
			}
			#echo($query);
			$success = $db->dbSelect($query);

			if ($success)
			{
				$result = $db->getResult();
				$resultArray = array();
				for ($i=0; $i<count($result); $i++)
				{
					array_push($resultArray,static::CreateFromArray($result[$i]));
				}
				return $resultArray;
			}
			else
			{
				return null;
				#throw new Exception('Failed to find ' . static::$tableName . ' where ' . $where);
			}
			$db->disconnect();
		}
		return null;
  }

  # Make it a little easier to find by query
  public static function FindByQuery($query = NULL)
  {
  	return self::Find(null,null,null,null,$query);
	}

	# Static methods for Object generation
	public static function CreateFromPost($post)
	{
		$sObject = new static();
		foreach ($post as $key => $value) {
			//print('<li>-'.$key.': '.$value);
			$sObject->$key = $value;
		}
		return $sObject;
	}

	public static function CreateFromArray($arr)
	{
		$sObject = new static();
		foreach ($arr as $key => $value) 
		{
			#print('<li>'.$key.': '.$value);
			#print('<li>'.$key.': '.$value);
			$sObject->$key = $value;
		}
		return $sObject;
	}

	# Delete method
	public static function delete($id)
	{
		if (static::$tableName != null)
		{
			$db = new static::$dbClass();
			$db->connect(true);

			if ($id != null) 
			{
				return $db->delete(static::$tableName, 'id='.$id);
			}
			$db->disconnect();
		}
		return null;
    }
}
?>