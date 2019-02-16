<?php

require_once("SaveableObject.php");

class FeaturedImage extends SaveableObject
{
	public $filename;
	public $tagline;
	public $url;
	public $title;
	public $description;
	public $createdDate;
	public $modifiedDate;
	
	protected static $tableName = 'featured_image';
	protected static $dbClass = 'Database';
	
	/** Methods **/
	protected function setSaveableFields() 
	{
		$this->saveableFields = array(
			'filename' => $this->filename,
			'tagline' => $this->tagline,
			'url' => $this->url,
			'title' => $this->title,
			'description' => $this->description,
			'createdDate' => $this->createdDate,
			'modifiedDate' => $this->modifiedDate
		);
	}
	public static function Load($id = NULL) 
	{
		# It's always #1
		return parent::Load('1');
	}
}
?>