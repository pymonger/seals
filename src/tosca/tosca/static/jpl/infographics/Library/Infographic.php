<?php
require_once("SaveableObject.php");
require_once("InfographicCategory.php");
require_once("InfographicCategoryXref.php");

class Infographic extends SaveableObject
{
	public $createdDate;
	public $modifiedDate;
	public $workflowDate;
	public $filename;
	public $keywords;
	public $categories;
	public $title;
	public $description;
	public $author;
	public $date;
	public $status;
	public $totalVotes;
	public $views;
	public $featured;
	public $editorPick;
	public $rating;
	public $comment;
	public $message;

	protected static $tableName = 'infographics';
	protected static $dbClass = 'Database';

	public function getRatingText() {
		$ratingText = '';
		for ($i=1; $i<=ceil($this->rating); $i++) { $ratingText .= '*'; }
		return $ratingText;
	}
	
	public function getStatusText()
	{
		switch ($this->status) {
		    case -1:
		        return 'Denied';
		        break;
		    case 0:
		        return 'Pending';
		        break;
		    case 1:
		        return 'Approved';
		        break;
		    default:
		    	return 'Unknown';
		    	break;
		}
	}

	protected function setSaveableFields($isUpdate = false) 
	{
		$this->saveableFields = array(
			'createdDate' => $this->createdDate,
			'modifiedDate' => $this->modifiedDate,
			'workflowDate' => $this->workflowDate,
			'filename' => $this->filename,
			'author' => $this->author,
			'keywords' => $this->keywords,
			'title' => $this->title,
			'description' => $this->description,
			'status' => $this->status,
			'totalVotes' => $this->totalVotes,
			'views' => $this->views,
			'featured' => $this->featured,
			'editorPick' => $this->editorPick,
			'comment' => $this->comment,
			'message' => $this->message
		);
	}


  #
  # SELECT METHODS
  #

	# Load and return a SINGLE new object from the db based on id
	public static function Load($id) {
    $sObject = new static();
		$db = new static::$dbClass();
		#echo('<br/>db? ' . print_r($db) . '...<br/>');
		$connected = $db->connect();
		#echo('<br/>connected? ' . $connected);
		if ($connected && $id != null) {
			$query = 'SELECT DISTINCT i.*, avg(ifnull(ratings.rating,0)) as rating, cats.categories
						FROM infographics i LEFT JOIN ratings ON (i.id = ratings.infographicid) 
						LEFT JOIN 
						  ( SELECT xref.infographicId, group_concat(cat.title separator ", ") as categories 
  							FROM infographic_category_xref as xref
  							INNER JOIN infographic_categories as cat ON (xref.categoryId = cat.id) GROUP BY xref.infographicId) 
							as cats ON (i.id = cats.infographicId)
						WHERE i.id = ' . $id . '
						GROUP BY i.id, cats.categories
						ORDER BY i.createdDate DESC;';
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
  public static function Search($searchStringCSV, $orderBy = NULL, $order = false, $limit = NULL, $limitStart = NULL) {
  	$where = null;
  	if ($searchStringCSV != null) 
  	{
  		$regexp = str_replace(',','|',$searchStringCSV);
			$where = "status=1 and (title REGEXP '" . $regexp . "' or keywords REGEXP '" . $regexp . "' or categories REGEXP '" . $regexp . "')";
   	}
	  #echo($orderBy);
	  if ($orderBy) $orderBy = $orderBy . ' ' . $order;

		return static::Find($where, $orderBy, $limit, $limitStart);
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

  		$query = 'SELECT i.*, avg(ifnull(ratings.rating,0)) as rating, cats.categories
  					FROM infographics i LEFT JOIN ratings ON (i.id = ratings.infographicid) 
  					LEFT JOIN 
  					  ( SELECT xref.infographicId, group_concat(cat.title separator ", ") as categories 
  							FROM infographic_category_xref as xref
  							INNER JOIN infographic_categories as cat ON (xref.categoryId = cat.id) GROUP BY xref.infographicId) 
  						as cats ON (i.id = cats.infographicId)
  					' . $where . '
  					GROUP BY i.id, cats.categories' . $orderBy . $limitString . ';';
	  }
	  #echo($query);
  	return parent::FindByQuery($query);
  }

  public static function FindByUsername($username, $where = NULL, $orderBy = NULL, $limit = NULL, $limitStart = NULL) {
  	$where = null;
  	if ($username != null)
  	{
  		$where = "author = '" . $username . "'";
  	}
  	return static::Find($where, $orderBy, $limit, $limitStart);
  }

  public static function FindByCategory($catId = NULL, $where = NULL, $orderBy = NULL, $limit = NULL, $limitStart = NULL) {
  	if ($catId == null) {
  		return static::Find($where,$orderBy,$limit,$limitStart);
  	}
  	else
  	{
      if ($where) { $where = ' WHERE (cats.categoryIds IS NOT NULL) AND ' . $where; }
      else { $where = ' WHERE (cats.categoryIds IS NOT NULL)'; }      
      if ($orderBy) { $orderBy = ' ORDER BY ' . $orderBy; }
      else { $orderBy = ' ORDER BY createdDate DESC'; }
      if ($limit) { 
        $limitString = ' LIMIT ';
        if ($limitStart) { $limitString .= $limitStart . ', '; }
        $limitString .= $limit;
      } else {
        $limitString = null;
      }


      $query = 'SELECT i.*, avg(ifnull(ratings.rating,0)) as rating, 
					cats.categories, cats.categoryIds
					FROM infographics i LEFT JOIN ratings ON (i.id = ratings.infographicid) 
					LEFT JOIN 
					  ( SELECT xref.infographicId, 
					  	group_concat(cat.title separator ", ") as categories,
							group_concat(cat.id separator ", ") as categoryIds
							FROM infographic_category_xref as xref
							INNER JOIN infographic_categories as cat ON (xref.categoryId = cat.id) 
							WHERE (cat.id = ' . $catId . ') 
							GROUP BY xref.infographicId ) 
					as cats ON (i.id = cats.infographicId)
					' . $where . '
					GROUP BY i.id, cats.categories' . $orderBy . $limitString . ';';
        #echo($query);
	  }
  	return parent::FindByQuery($query);
  }

  #
  # INSERT/UPDATE METHODS
  #
	public function save ($post = null) 
	{
    if ($post == null) $post = $_POST;
		$returnValueOrNewId = parent::save();
		echo("<br/>Infographic $this->title saving... what's its ID? " . $returnValueOrNewId);
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
						echo("<br/>Creating category_xref: $value");
						$thisCategoryXref['infographicId'] = $returnValueOrNewId;
						$thisCategoryXref['categoryName'] = $value;
						$thisCategoryXref = InfographicCategoryXref::CreateFromArray($thisCategoryXref);
						array_push($categoryXrefs,$thisCategoryXref);
					}
				}
			}
			# Delete the old category xrefs if they exist
			InfographicCategoryXref::deleteAllByInfographicId($returnValueOrNewId);
			# Create the new ones
			if (count($categoryXrefs) > 0)
			{
				foreach ($categoryXrefs as $categoryXref)
				{
					echo("<br/>Is category_xref saved? ");
					echo($categoryXref->save());
				}
			}
			return $returnValueOrNewId;
		}

	}

  #
  # Ratings
  #
  public static function rate($infographicId, $rating, $userId)
  {
    $db = new static::$dbClass();
    $db->connect(true);
    $set = array('rating'=>$rating,'modifiedDate'=>'NOW()');
    $where = array('userId',$userId,'infographicId',$infographicId);
    if ($db->update('ratings', $set, $where))
    {
      if ($db->getNumAffectedRows() > 0)
      {
        return true;
      }
      else 
      {
        $values = array($rating,$infographicId,$userId,'NOW()','NOW()');
        $fieldnames = array('rating','infographicId','userId','modifiedDate','createdDate');
        if ($db->insert('ratings', $values, $fieldnames))
        {
          return true;
        }
        else
        {
          return false;
        }
      }
    }
    else
    {
      return false;
    }
    $db->disconnect();
  }  
}
?>