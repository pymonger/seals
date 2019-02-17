<?php

require_once("SaveableObject.php");

class InfographicCategory extends SaveableObject
{
	public $title;
	public $filename;
	public $description;
	public $infographicId;
	public $sortOrder;
	public $createdDate;
	public $modifiedDate;
	
	protected static $tableName = 'infographic_categories';
	protected static $dbClass = 'Database';
	
	/** Methods **/
	protected function setSaveableFields() 
	{
		$this->saveableFields = array(
			'title' => $this->title,
			'description' => $this->description,
			'filename' => $this->filename,
			'infographicId' => $this->infographicId,
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
}
?>