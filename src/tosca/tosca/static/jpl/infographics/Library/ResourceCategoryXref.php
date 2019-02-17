<?php

require_once("SaveableObject.php");

class ResourceCategoryXref extends SaveableObject
{
	public $resourceId;
	public $categoryId;
	public $categoryName;
	public $createdDate;
	public $modifiedDate;
	
	protected static $tableName = 'resource_category_xref';
	protected static $dbClass = 'Database';
	
	/** Methods **/
	protected function setSaveableFields() 
	{
		$this->saveableFields = array(
			'resourceId' => $this->resourceId,
			'categoryId' => $this->categoryId,
			'createdDate' => $this->createdDate,
			'modifiedDate' => $this->modifiedDate
		);
	}


	public static function deleteAllByResourceId($id)
	{
		$sObject = new static();
		$db = new static::$dbClass();
		#echo('<br/>db? ' . print_r($db) . '...<br/>');
		$connected = $db->connect(true);
		#echo('<br/>connected? ' . $connected);
		if ($connected && $id != null) {
			return $db->delete(static::$tableName, 'resourceId = ' . $id);
		}
		else 
		{
			return false;
		}
	
	}

	public function save()
	{
		#echo("<li>saving rcx</li>");
		#echo("<li>resource id: $this->resourceId</li>");
		#echo("<li>cat id: $this->categoryId</li>");
		#echo("<li>cat name: $this->categoryName</li>");
		if ($this->resourceId != null)
		{
			if ($this->categoryId != null)
			{
				return parent::save();
			} 
			else if ($this->categoryName != null)
			{
				$db = new static::$dbClass();
				$db->connect(true);
				$q = "insert into resource_category_xref (resourceId, categoryId) 
					select $this->resourceId, id from resource_categories where title='".mysql_real_escape_string($this->categoryName)."';";
				echo($q);
				return $db->dbInsert($q);
			}
			return null;
		}
	}
}
?>