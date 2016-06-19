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
    public $ID;
				
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
        $result = cfr('Person_Info', 'row');
        if ($result != FALSE)
        {
            $this->ID = $result->personID;
            $this->username = $result->username;
            $this->firstName = $result->firstName;
            $this->lastName = $result->lastName;
            $this->email = $result->email;

            $this->session->user = $this->objectify($result);
        }
        return $result;
    }

    public function add_user($user_id, $role=NULL)
    {
        if ($role === NULL)
        {
            $role = ACCESSLEVEL_REGULAR;
        }

        $data = array(
            'id'=>$user_id,
            'access_level'=>$role,
            'last_login'=>date(SERVER_DATE_STR)
        );

        $this->db->insert('User', $data);

        $this->validate($user_id);
    }
    
    public function get_role_in_section($user_id, $section_id, $add_if_none=FALSE)
    {
        $this->db->where('user', $user_id);
        $this->db->where('section', $section_id);
        $user_in_section = cfr('User_IN_Section', 'row');
        
        if (!$user_in_section && $add_if_none)
        {
            $role = $this->sync_user_in_section($user_id, $section_id);
        }
        else
        {
            $role = $user_in_section->role;
        }
        
        return $role;
    }

    public function log_user_access($user_id)
    {
        $this->validate($user_id);

        $this->db->where('id' ,$user_id);
        $this->db->update('User', array(
            'last_login'=>date(SERVER_DATE_STR)
        ));
    }

    public function sync_user_in_section($user_id, $section_id)
    {
        $role = ACADEMICROLE_STU;
        // TODO: User roster services to ensure appropriate access
        return $role;
    }

    public function objectify($source)
    {
        $person_props = [
            'firstName'=>'firstName',
            'lastName'=>'lastName',
            'username'=>'username',
            'email'=>'email',
            'personID'=>'id'
        ];
        $role_props = [
            'access_level'=>'id',
            'access_level_name'=>'name',
            'access_level_order'=>'order'
        ];
        $person = new stdClass();
        foreach ($person_props as $prop=>$new_prop)
        {
            $person->$new_prop = property_exists($source, $prop)
                ? $source->$prop
                : NULL;
        }
        $role = new stdClass();
        foreach ($role_props as $prop=>$new_prop)
        {
            $role->$new_prop = property_exists($source, $prop)
                ? $source->$prop
                : NULL;
        }
        $person->accessLevel = $role;
        $person->name = $person->firstName . ' ' . $person->lastName;
        return $person;
    }
}