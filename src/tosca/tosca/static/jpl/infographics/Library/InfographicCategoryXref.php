<?php

require_once("SaveableObject.php");

class InfographicCategoryXref extends SaveableObject
{
	public $infographicId;
	public $categoryId;
	public $categoryName;
	public $createdDate;
	public $modifiedDate;
	
	protected static $tableName = 'infographic_category_xref';
	protected static $dbClass = 'Database';
	
	/** Methods **/
	protected function setSaveableFields() 
	{
		$this->saveableFields = array(
			'infographicId' => $this->infographicId,
			'categoryId' => $this->categoryId,
			'createdDate' => $this->createdDate,
			'modifiedDate' => $this->modifiedDate
		);
	}


	public static function deleteAllByInfographicId($id)
	{
		$sObject = new static();
		$db = new static::$dbClass();
		#echo('<br/>db? ' . print_r($db) . '...<br/>');
		$connected = $db->connect(true);
		#echo('<br/>connected? ' . $connected);
		if ($connected && $id != null) {
			return $db->delete(static::$tableName, 'infographicId = ' . $id);
		}
		else 
		{
			return false;
		}
	
	}

	public function save()
	{
		#echo("<li>saving icx</li>");
		#echo("<li>iid: $this->infographicId</li>");
		#echo("<li>cid: $this->categoryId</li>");
		#echo("<li>cname: $this->categoryName</li>");
		if ($this->infographicId != null)
		{
			if ($this->categoryId != null)
			{
				return parent::save();
			} 
			else if ($this->categoryName != null)
			{
				$db = new static::$dbClass();
				$db->connect(true);
				$q = "insert into infographic_category_xref (infographicId, categoryId) 
					select $this->infographicId, id from infographic_categories where title='".mysql_real_escape_string($this->categoryName)."';";
				echo($q);
				return $db->dbInsert($q);
			}
			return null;
		}
	}
}
?>