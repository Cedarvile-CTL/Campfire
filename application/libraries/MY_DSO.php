<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Local DSO extension
 *
 * Local wrapper for DSO. 
 *
 * @package    App_name
 * @subpackage Library
 * @author     Phil Schanely <philschanely@cedarville.edu>
 */
class MY_DSO extends CI_DSO {
    
    public function load_defaults() 
    {
        $this->page_title = 'Campfire';
        $this->page_id = 'page-campfire';
        $this->crumbs = breadcrumbs();
        $this->auth_in_app = FALSE;
        $this->stylesheets = array();
        $this->base_url = base_url();
        $this->hasJavaScripts = FALSE;
        $this->querystring = $_SERVER['QUERY_STRING'];
    }
}