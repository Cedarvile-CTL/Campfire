<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Main extends CI_Controller {

    public function __construct() 
    {
        parent::__construct();
        ENVIRONMENT == 'development' 
            ? $this->output->enable_profiler(TRUE) : TRUE;
        $this->authenticate->check_for_auth();
    }
    
    /**
     * Dashboard
     */
    public function index()
    {
        $this->dso->page_title = 'Dashboard';
        $this->dso->page_id = 'page-dashboard';
        $this->dso->crumbs = breadcrumbs();
        show_view('welcome_message', $this->dso->all);
    }
}
