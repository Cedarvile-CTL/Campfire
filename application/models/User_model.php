<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * User Model
 *
 * Details to come.
 *
 * @package    Thorin
 * @subpackage Models
 * @author     Phil Schanely <philschanely@cedarville.edu>
 */
class User_model extends CI_Model {
    
    public $username;
    public $firstName;
    public $lastName;
    public $email;
    public $accessLevelID;
    public $is_default;
    public $is_auth;
    public $is_editor;
    public $is_admin;
				
    public function __construct()
    {
        parent::__construct();
    }
    
    /**
     * Validate a user
     * 
     * @param int $user_id
     * 
     * @return object
     */
    public function validate($user_id)
    {
        $this->db->where('personID', $user_id);
        $query = $this->db->get('Person_Info');
        $result = checkForResults($query, 'row');
        if ($result != FALSE)
        {
            $this->ID = $result->personID;
            $this->username = $result->username;
            $this->firstName = $result->firstName;
            $this->lastName = $result->lastName;
            $this->email = $result->email;
        }
        return $result;
    }
}