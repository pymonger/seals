<?php
/*
 * Based on the following author's code:
 * File Name: Database.php
 * Date: November 18, 2008
 * Author: Angelo Rodrigues
 * Description: Contains database connection, result
 *              Management functions, input validation
 *
 *              All functions return true if completed
 *              successfully and false if an error
 *              occurred
 *
 */
date_default_timezone_set('America/Los_Angeles'); # temporarily added to allow date functions without warning may 17

class DatabaseCore
{
    private static $defaultServer; # 'local' 'dev' 'mt' 'jplstage' 'jpllive'
    /*
     * Edit the following variables
     */
    protected $db_host;  # Database Host
    protected $db_host_writeable;  # Database Host
    protected $db_user;  # Username
    protected $db_pass;  # Password
    protected $db_name;  # Database
    public $main_server_path;
    public $upload_server_path;
                 
    /*
     * End edit
     */

    private $con = false;       # Checks to see if the connection is active
    private $result = array();  # Results that are returned from the query
    private $numAffectedRows;  # Results that are returned from the query

    /*
     * Connects to the database, only one connection
     * allowed
     */
    public function connect($writeable = false)
    {
        if(!$this->con)
        {
            #if ($writeable == true) print("<br/>Writeable");
            #else print("<br/>Not Writeable");
            $host = ($writeable == true) ? $this->db_host_writeable : $this->db_host;
            #print("<br/>Connecting to " . $this->db_name . " at host: " . $host);
            $myconn = @mysql_connect($host,$this->db_user,$this->db_pass);
            if($myconn)
            {
                $seldb = @mysql_select_db($this->db_name,$myconn);
                if($seldb)
                {
                    $this->con = true;
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        else
        {
            return true;
        }
    }

    /*
     * Disconnect from database
     *
     */
    public function disconnect()
    {
        if($this->con)
        {
            if(@mysql_close())
            {
                $this->con = false;
                return true;
            }
            else
            {
                return false;
            }
        }
    }

    /*
    * Changes the new database, sets all current results
    * to null
    */
    public function setDatabase($name)
    {
        if($this->con)
        {
            //if(@mysql_close()) // BERGEN
            if (disconnect())
            {
                $this->con = false;
                $this->results = null;
                $this->db_name = $name;
                $this->connect();
            }
        }
    }

    /*
    * Checks to see if the table exists when performing
    * queries
    */
    private function tableExists($table)
    {
        $tablesInDb = @mysql_query('SHOW TABLES FROM '.$this->db_name.' LIKE "'.$table.'"');
        if($tablesInDb)
        {
            if(mysql_num_rows($tablesInDb)==1)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }

    /*
    * Selects information from the database.
    * Required: table (the name of the table)
    * Optional: columns (the columns requested, separated by commas)
    *           where (column = value as a string)
    *           order (column DIRECTION as a string)
    */
    public function select($table, $columns = '*', $where = null, $order = null, $limit = null, $limitStart = NULL)
    {
        $q = 'SELECT '.$columns.' FROM '.$table;
        if($where != null)
            $q .= ' WHERE '.$where;
        if($order != null)
            $q .= ' ORDER BY '.$order;
        if($limit != null)
            $q .= ' LIMIT '.$limit;
        if ($limit) { 
            $q .= ' LIMIT ';
            if ($limitStart) { $q .= $limitStart . ', '; }
            $q .= $limit;
        }

        #print("<br/>".$q);

        $query = @mysql_query($q);
        if($query)
        {
            $this->numResults = mysql_num_rows($query);
            for($i = 0; $i < $this->numResults; $i++)
            {
                $r = mysql_fetch_array($query);
                $key = array_keys($r);
                for($x = 0; $x < count($key); $x++)
                {
                    # Sanitizes keys so only alphavalues are allowed
                    if(!is_int($key[$x]))
                    {
                        if(mysql_num_rows($query) > 1)
                            $this->result[$i][$key[$x]] = $r[$key[$x]];
                        else if(mysql_num_rows($query) < 1)
                            $this->result = null;
                        else
                            $this->result[$key[$x]] = $r[$key[$x]];
                    }
                }
            }
            return true;
        }
        else
        {
            return false;
        }
    }

    /*
    * Insert values into the table
    * Required: table (the name of the table)
    *           values (the values to be inserted)
    * Optional: columns (if values don't match the number of columns)
    */
    public function insert($table,$values,$columns = null)
    {
        if($this->tableExists($table))
        {
            $insert = 'INSERT INTO '.$table;
            if($columns != null)
            {
                if (is_array($columns)) 
                {
                    #print('columns is array');
                    $columns_string = implode(',',$columns);
                } 
                else
                {
                    #print('columns is not array');
                    $columns_string = $columns;
                    $columns = explode(',',$columns_string);
                }
                $insert .= ' ('.$columns_string.')';
            }

            for($i = 0; $i < count($values); $i++)
            {
                #print("<li>$columns[$i]=$values[$i]\n");
                
                // Check for forced overrides (in Database.php)
                if(isset($this->insertOverrides[$columns[$i]]))
                {
                    print('<i>Setting ' . $columns[$i] . ' to ' . $this->insertOverrides[$columns[$i]] . '</i>');
                    $values[$i] = $this->insertOverrides[$columns[$i]];
                } 
                // Write strings in quotes (except NOW()), others without
                if (is_string($values[$i]) && $values[$i] != 'NOW()') 
                {
                    $values[$i] = '"'.mysql_real_escape_string($values[$i]).'"';
                }
            }
            $valueString = implode(',',$values);

            $insert .= ' VALUES ('.$valueString.')';

            print("<br/>".$insert);
            #print("<br/>db_name=".$this->db_name);
            #print("<br/>db_user=".$this->db_user);
            print("<br/>db_host=".$this->db_host);
            print("<br/>db_host_writeable=".$this->db_host_writeable);

            $result = mysql_query($insert);
            print("<br/>result = " . $result . "<br/>");
            return $result;
        }
    }

    /*
     * Updates the database with the values sent
     * Required: table (the name of the table to be updated
     *           columns (the columns/values in a key/value array
     *           where (the column/condition in an array (column,condition) )
     */
    public function update($table,$columns,$where)
    {
        #echo ('<br/>Update - Table: ' . $table);
        #echo ('<br/><pre>Columns: ');
        #print_r($columns);
        #echo ('<br/>Where: ');
        #print_r($where);
        #print('</pre>');
        if($this->tableExists($table))
        {
            # Parse the where values
            # even values (including 0) contain the where columns
            # odd values contain the clauses for the column
            for($i = 0; $i < count($where); $i++)
            {
                if($i%2 != 0)
                {
                    if(is_string($where[$i]))
                       $where[$i] = ' = "'.mysql_real_escape_string($where[$i]).'"';
                    else
                       $where[$i] = ' = '.$where[$i];

                    if ($i+1 < count($where))
                        $where[$i] .= ' AND ';
                }

            }
            $where = implode('',$where);


            $update = 'UPDATE '.$table.' SET ';
            $keys = array_keys($columns);
            for($i = 0; $i < count($columns); $i++)
            {
                // Check for forced overrides (in Database.php)
                #print("<li>" . $keys[$i] . ': ' . $columns[$keys[$i]]);
                if(isset($this->updateOverrides[$keys[$i]]))  
                {
                    #print('<br />Setting ' . $keys[$i] . ' to ' . $this->updateOverrides[$keys[$i]]);
                    $values[$i] = $this->updateOverrides[$keys[$i]];
                } 
                // Write strings in quotes (except NOW()), others without
                if(is_string($columns[$keys[$i]]) && $columns[$keys[$i]] != 'NOW()')
                {
                    $update .= $keys[$i].'="'.mysql_real_escape_string($columns[$keys[$i]]).'"';
                }
                else
                {
                    $update .= $keys[$i].'='.$columns[$keys[$i]];
                }
              
                // Parse to add commas
                if($i != count($columns)-1)
                {
                    $update .= ', ';
                }
            }
            $update .= ' WHERE '.$where;

            # print("<br/>SQL: ".$update);

            $result = @mysql_query($update);
            $this->numAffectedRows = mysql_affected_rows();
            return $result;
        }
        else
        {
            return false;
        }
    }


    /*
    * Deletes table or records where condition is true
    * Required: table (the name of the table)
    * Optional: where (condition [column =  value])
    */
    public function delete($table,$where = null)
    {
        if($this->tableExists($table))
        {
            if($where == null)
            {
                $delete = 'DELETE '.$table;
            }
            else
            {
                $delete = 'DELETE FROM '.$table.' WHERE '.$where;
            }
            #print("<br/>.".$delete);

            return @mysql_query($delete);
        }
        else
        {
            return false;
        }
    }

    # Custom queries
    public function dbInsert($q)
    {
        if (strpos(strtoupper($q),'INSERT') != 0) {
            throw new Exception('Security Exception: dbInsert calls must start with INSERT');
        }
        if (strpos($q,';') != false && strpos($q,';') < (strlen($q)-1)) {
            throw new Exception('Security Exception: dbInsert calls may only have semicolons as the last character.');
        }
        return @mysql_query($q);
    }


    public function dbSelect($q)
    {
        if (strpos(strtoupper($q),'SELECT') != 0) {
            throw new Exception('Security Exception: dbSelect calls must start with SELECT');
        }
        if (strpos($q,';') != false && strpos($q,';') < (strlen($q)-1)) {
            throw new Exception('Security Exception: dbSelect calls may only have semicolons as the last character.');
        }
        $query = @mysql_query($q);
        #echo('<hr>');
        #echo($this->db_name);
        #echo('<hr>');
        #echo($q);

        if ($query)
        {
            $this->numResults = mysql_num_rows($query);
            for($i = 0; $i < $this->numResults; $i++)
            {
                $r = mysql_fetch_array($query);
                $key = array_keys($r);
                for($x = 0; $x < count($key); $x++)
                {
                    // Sanitizes keys so only alphavalues are allowed
                    if(!is_int($key[$x]))
                    {
                        if(mysql_num_rows($query) > 1 || strpos(strtoupper($q),'DISTINCT') === false)
                            $this->result[$i][$key[$x]] = $r[$key[$x]];
                        else if(mysql_num_rows($query) < 1)
                            $this->result = null;
                        else
                            $this->result[$key[$x]] = $r[$key[$x]];
                    }
                }
            }
            return true;
        }
        else
        {
            return false;
        }
    }


    /*
    * Returns the result set
    */
    public function getResult()
    {
        return $this->result;
    }
    /*
    * Returns the result set
    */
    public function getNumAffectedRows()
    {
        return $this->numAffectedRows;
    }

    public function getUserName()
    {
        return $this->db_user;
    }
    public function getDatabaseName()
    {
        return $this->db_name;
    }
    public function getHostName()
    {
        return $this->db_host;
    }

    protected function getServerConfig()
    { 
        $server = self::$defaultServer;

        $domain = $_SERVER['HTTP_HOST'];
        if (isset($_SERVER['HTTP_HOST']))
        {
            #print("<br/>SERVER['HTTP_HOST'] = " . $domain);
            switch($domain)
            {
              case 'bergen.local':
                $server = 'local';
                break;
              case 'dev.mooreboeck.com':
                $server = 'dev';
                break;
              case 'localhost':
              case 'www-stage.jpl.nasa.gov':
                $server = 'jplstage';
                break;
              case 'www.jpl.nasa.gov':
              case 'jpl.nasa.gov':
                $server = 'jpllive';
                break;
            }   
        }
        #print("<br/>setting server to " . $server);
        return $server;
    }
}
?>
