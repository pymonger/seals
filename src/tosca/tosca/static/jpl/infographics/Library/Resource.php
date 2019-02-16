<?php

require_once("SaveableObject.php");
require_once("ResourceCategory.php");
require_once("ResourceCategoryXref.php");

class Resource extends SaveableObject
{
	public $createdDate;
	public $modifiedDate;
	public $filename;
	public $filenameThumb;
	public $categories;
	public $title;
	public $description;
	public $workflowDate;

	protected static $tableName = 'resources';
	protected static $dbClass = 'Database';

	protected function setSaveableFields() 
	{
		$this->saveableFields = array(
			'createdDate' => $this->createdDate,
			'modifiedDate' => $this->modifiedDate,
			'filename' => $this->filename,
			'filenameThumb' => $this->filenameThumb,
			'title' => $this->title,
			'description' => $this->description
		);
	}


	# Load and return a new object from the db based on id
	public static function Load($id) {
    $sObject = new static();
		$db = new static::$dbClass();
		$connected = $db->connect();
		if ($connected && $id != null) {
			$query = 'SELECT DISTINCT r.*, cats.categories, cats.categoryIds
						FROM resources r 
						LEFT JOIN 
						  ( SELECT DISTINCT xref.resourceId, 
						  	group_concat(cat.title separator ", ") as categories, 
						   	group_concat(cat.id separator ", ") as categoryIds  
  							FROM resource_category_xref as xref
  							INNER JOIN resource_categories as cat ON (xref.categoryId = cat.id) GROUP BY xref.resourceId ) 
						as cats ON (r.id = cats.resourceId)
						WHERE r.id = ' . $id . '
						GROUP BY r.id, cats.categories;';
			#echo("<br/>$query");
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
		return $sObject;
  }

  # Return an array of results from the database
  public static function Find($where = NULL, $orderBy = NULL, $limit = NULL, $limitStart = NULL, $query = NULL) {
  	if ($query == null) 
  	{
		if ($where) { $where = ' WHERE ' . $where; }
		if ($orderBy) { $orderBy = ' ORDER BY ' . $orderBy; }
		else { $orderBy = ' ORDER BY createdDate DESC'; }
		if ($limit) { 
      $limitString = ' LIMIT ';
      if ($limitStart) { $limitString .= $limitStart . ', '; }
      $limitString .= $limit;
    } else {
      $limitString = null;
    }

		$query = 'SELECT r.*, cats.categories, cats.categoryIds
					FROM resources r 
					LEFT JOIN 
					  ( SELECT xref.resourceId, 
					  	group_concat(cat.title separator ", ") as categories,
					   	group_concat(cat.id separator ", ") as categoryIds  
							FROM resource_category_xref as xref
							INNER JOIN resource_categories as cat ON (xref.categoryId = cat.id) GROUP BY xref.resourceId ) 
					as cats ON (r.id = cats.resourceId)
					' . $where . '
					GROUP BY r.id, cats.categories' . $orderBy . $limitString . ';';
	}
  	return parent::FindByQuery($query);
  }

# BERGEN: MAYBE ADD LIMITS TO OTHER METHODS

    # Return an array of results from the database
    public static function FindByCategory($catId, $orderBy = NULL, $limit = NULL, $limitStart = NULL) {
    	if ($catId == null) {
    		return static::Find(null,$orderBy);
    	}
    	else
      {
				if ($orderBy) { $orderBy = ' ORDER BY ' . $orderBy; }
				else { $orderBy = ' ORDER BY createdDate DESC'; }
				if ($limit) { 
	        $limitString = ' LIMIT ';
	        if ($limitStart) { $limitString .= $limitStart . ', '; }
	        $limitString .= $limit;
	      } else {
	        $limitString = null;
	      }

				$query = 'SELECT r.*, cats.categories, cats.categoryIds
						FROM resources r 
						LEFT JOIN 
						  ( SELECT xref.resourceId, 
						  	group_concat(cat.title separator ", ") as categories,
						   	group_concat(cat.id separator ", ") as categoryIds  
  							FROM resource_category_xref as xref
  							INNER JOIN resource_categories as cat ON (xref.categoryId = cat.id) 
								WHERE (cat.id = ' . $catId . ')
  								GROUP BY xref.resourceId )
						as cats ON (r.id = cats.resourceId)
						WHERE (cats.categoryIds IS NOT NULL)
						GROUP BY r.id, cats.categories' . $orderBy . $limitString . ';';
			}
    	return parent::FindByQuery($query);
    }

	public function save ($post = null) 
	{
		if ($post == null) $post = $_POST;
		$returnValueOrNewId = parent::save();
		//echo("Resource $this->title saved? $returnValueOrNewId");
		if (is_string($returnValueOrNewId) == false) 
		{
			return $returnValueOrNewId;
		}
		else
		{
			# Save the categories
			$categoryXrefs = array();
			foreach ($post as $key => $value) {
				if ($key == 'categories') 
				{
					foreach ($value as $key => $value) {
						$thisCategoryXref = array();
						//echo("<br/>creating categoryxref: $value");
						$thisCategoryXref['resourceId'] = $returnValueOrNewId;
						$thisCategoryXref['categoryName'] = $value;
						$thisCategoryXref = ResourceCategoryXref::CreateFromArray($thisCategoryXref);
						array_push($categoryXrefs,$thisCategoryXref);
					}
				}
			}
			# Delete the old category xrefs if they exist
			ResourceCategoryXref::deleteAllByResourceId($returnValueOrNewId);
			# Create the new ones
			if (count($categoryXrefs) > 0)
			{
				foreach ($categoryXrefs as $categoryXref)
				{
					//echo("<br/>categoryxref saved? ");
					$xrefResult = $categoryXref->save();
				}
			}
			return $returnValueOrNewId;
		}

	}

}
?>