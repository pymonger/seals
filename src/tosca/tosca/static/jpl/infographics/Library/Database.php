<?php

require_once("DatabaseCore.php");

class Database extends DatabaseCore
{
    public function __construct()
    { 
        switch (self::getServerConfig())
        {
            case 'local':
                $this->db_host = 'localhost';  # Database Host
                $this->db_host_writeable = 'bergen.local';  # Database Host
                $this->db_user = 'infographics';  # Username
                $this->db_pass = '!mag3!f04JPL';  # Password
                $this->db_name = 'infographics';  # Database
                $this->main_server_path = 'http://localhost/~bergen/jpl/infographics/';
                $this->upload_server_path = './';#http://dev.mooreboeck.com/~mooreboeck/mooreboeck.com/extranet/jpl/jplinfographics/dev/php/';
                break;
            case 'dev':
                $this->db_host = 'localhost';  # Database Host
                $this->db_host_writeable = 'localhost';  # Database Host
                $this->db_user = 'infographics';  # Username
                $this->db_pass = '!mag3!f04JPL';  # Password
                $this->db_name = 'infographics';  # Database
                $this->main_server_path = './'; # http://dev.mooreboeck.com/~mooreboeck/mooreboeck.com/extranet/jpl/jplinfographics/dev/php/';
                $this->upload_server_path = './'; #http://bergen.local/~bergen/jpl/infographics/';
                break;
            case 'mt':
                $this->db_host = 'internal-db.s70572.gridserver.com';  # Database Host
                $this->db_host_writeable = 'internal-db.s70572.gridserver.com';  # Database Host
                $this->db_user = 'db70572_info'; # Username
                $this->db_pass = '!mag3!f04JPL';  # Password
                $this->db_name = 'db70572_infographics';  # Database
                #$this->main_server_path = 'http://bergen.local/~bergen/jpl/infographics/';
                #$this->upload_server_path = 'http://dev.mooreboeck.com/~mooreboeck/mooreboeck.com/extranet/jpl/jplinfographics/dev/php/';
                break;
            case 'jpllive';
                $this->db_host = 'localhost';  # Database Host
                $this->db_host_writeable = 'www-stage';  # Database Host
                $this->db_user = 'infographics'; # Username
                $this->db_pass = '!mag3!f04JPL';  # Password
                $this->db_name = 'infographics';  # Database
                $this->main_server_path = 'http://www.jpl.nasa.gov/infographics/';
                $this->upload_server_path = 'http://imagecache.jpl.nasa.gov/infographics/';
                break;
            case 'jplstage':
            default:
                $this->db_host = 'localhost';  # Database Host
                $this->db_host_writeable = 'localhost';  # Database Host
                $this->db_user = 'infographics'; # Username
                $this->db_pass = '!mag3!f04JPL';  # Password
                $this->db_name = 'infographics';  # Database
                $this->main_server_path = 'http://www-stage.jpl.nasa.gov/infographics/';
                $this->upload_server_path = 'http://imagecache.jpl.nasa.gov/infographics/';
                break;

        }
        #print("<br/>New DB set up as " . self::getServerConfig());
    }
}
class UserDatabase extends DatabaseCore
{
    #public static $server = 'dev'; # 'local' 'dev' 'mt' 'jplstage' 'jpllive'

    public function __construct()
    {    
        switch (self::getServerConfig())
        {
            case 'local':
            case 'dev':
                $this->db_host = 'localhost';  # Database Host
                $this->db_host_writeable = 'localhost';  # Database Host
                $this->db_user = 'imageusers';  # Username
                $this->db_pass = 'ratestars';  # Password
                $this->db_name = 'spaceimagesv2';  # Database
                break;
            case 'mt':
                $this->db_host = 'internal-db.s70572.gridserver.com';  # Database Host
                $this->db_host_writeable = 'localhost';  # Database Host
                $this->db_user = 'db70572_info'; # Username
                $this->db_pass = 'ratestars';  # Password
                $this->db_name = 'db70572_spaceimages';  # Database
                break;
            case 'jpllive':
                $this->db_host = 'localhost';  # Database Host
                $this->db_host_writeable = 'www-stage';  # Database Host
                $this->db_user = 'imageusers'; # Username
                $this->db_pass = 'ratestars';  # Password
                $this->db_name = 'spaceimagesv2';  # Database
                break;
            case 'jplstage':
            default:
                $this->db_host = 'localhost';  # Database Host
                $this->db_host_writeable = 'localhost';  # Database Host
                $this->db_user = 'imageusers'; # Username
                $this->db_pass = 'ratestars';  # Password
                $this->db_name = 'spaceimagesv2';  # Database
                break;
        }
		#print("<br/>New DB set up as " . self::getServerConfig());
    }
}
?>