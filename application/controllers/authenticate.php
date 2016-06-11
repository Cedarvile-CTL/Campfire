<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Authentication controller
 *
 * @package    CI_Starter
 * @subpackage Controllers
 * @author     Phil Schanely <philschanely@cedarville.edu>
 */
class Authenticate extends CI_Controller {
    
    /**
     * Constructor
     * 
     * Sets up profiling.
     */
    public function __construct() 
    {
        parent::__construct();
        ENVIRONMENT == 'development' ? $this->output->enable_profiler(TRUE) : TRUE;
    }
    
    /**
     * =========================================================================
     *  Public Methods
     * =========================================================================
     */
    
    /**
     * Login
     * 
     * @return null View output
     */
    public function login()
    {
        $this->dso->page_title = 'Log in';
        $this->dso->page_id = 'page-login'; 
	    $this->dso->auth_in_app = FALSE;
        $this->dso->login_error = FALSE;
        $this->dso->crumbs = '';
        $referral = $this->input->get('ref') 
            ? $this->input->get('ref')
            : NULL;
        $this->dso->referral = $referral;
        $this->authenticate->login($this->dso->all, NULL, $this->dso->referral);
    }
    
    /**
     * Logout
     * 
     * @return null View output
     */
    public function logout()
    { 
        $this->dso->page_title = 'Log out';
        $this->dso->page_id = 'page-logout';
	$this->dso->auth_in_app = FALSE;
        $this->dso->crumbs = '';
        $this->authenticate->logout($this->dso->all);
    }
}