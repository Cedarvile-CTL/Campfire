<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Local Authentication extension
 *
 * Local wrapper for core authenticate class. Customize values set in the 
 * constructor function for this application.
 *
 * @package    Campfire
 * @subpackage Library
 * @author     Phil Schanely <philschanely@cedarville.edu>
 */
class MY_Authenticate extends CI_Authenticate {
    
    var $is_ajax;
    
    public function __construct($config = array()) 
    {
        // Initialize the core class
        parent::__construct($config);
        
        $this->is_ajax = $this->CI->input->is_ajax_request();
        
        // Local settings --------
        
        // Session prefix for all authenctication values
        $this->prefix = 'campfire';
    }
    
    public function check_for_auth($app_prefix=NULL, $login_url=NULL, $force=NULL)
    {
//        ep('Trying to log in user');
        $userID = parent::check_for_auth($app_prefix, $login_url, $force);
        $user = $this->CI->user_model->validate($userID);
        if ($user == FALSE)
        {
            $this->CI->dso->auth_in_app = FALSE;
            if ($force) redirect($login_url);
        }
        else
        {
            $this->CI->dso->user = $user;
            $this->CI->dso->is_admin =
                $user->access_level == ACCESSLEVEL_ADMIN || $user->access_level == ACCESSLEVEL_SUPERADMIN
                ? TRUE
                : FALSE;
            $this->CI->dso->is_superadmin = $user->access_level == ACCESSLEVEL_SUPERADMIN
                ? TRUE
                : FALSE;
            $this->CI->dso->auth_in_app = TRUE;
        }
        return $user;
    }
}