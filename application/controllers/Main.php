<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Main extends CI_Controller {

    public function __construct() 
    {
        parent::__construct();
        ENVIRONMENT == 'development' 
            ? $this->output->enable_profiler(TRUE) : TRUE;
        #$this->authenticate->check_for_auth();
    }
    
    public function index()
    {
        $this->dso->page_title = 'Campfire';
        show_view('ng-view', $this->dso->all);
    }
}
