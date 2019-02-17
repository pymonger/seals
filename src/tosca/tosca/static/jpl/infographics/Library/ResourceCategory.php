<?php

require_once("SaveableObject.php");

class ResourceCategory extends SaveableObject
{
	public $title;
	public $filename;
	public $description;
	public $link1;
	public $link2;
	public $link3;
	public $link4;
	public $link5;
	public $url1;
	public $url2;
	public $url3;
	public $url4;
	public $url5;
	public $sortOrder;
	public $createdDate;
	public $modifiedDate;
	
	protected static $tableName = 'resource_categories';
	protected static $dbClass = 'Database';
	
	/** Methods **/
	protected function setSaveableFields() 
	{
		$this->saveableFields = array(
			'title' => $this->title,
			'filename' => $this->filename,
			'description' => $this->description,
			'link1' => $this->link1,
			'link2' => $this->link2,
			'link3' => $this->link3,
			'link4' => $this->link4,
			'link5' => $this->link5,
			'url1' => $this->url1,
			'url2' => $this->url2,
			'url3' => $this->url3,
			'url4' => $this->url4,
			'url5' => $this->url5,
			'sortOrder' => $this->sortOrder,
			'createdDate' => $this->createdDate,
			'modifiedDate' => $this->modifiedDate
		);
	}

  public static function Find($where = NULL, $orderBy = NULL, $limit = NULL, $limitStart = NULL, $query = NULL) 
	{
		if ($orderBy == NULL) 
			$orderBy = 'sortOrder';
		return parent::Find($where, $orderBy, $limit, $limitStart, $query);
	}

  public static function FindRandomCategory() 
	{
		$results = parent::Find('filename IS NOT NULL', 'RAND()', 1);
		if (count($results) > 0)
			return $results[0];
		else
			return null;
	}
}
?>