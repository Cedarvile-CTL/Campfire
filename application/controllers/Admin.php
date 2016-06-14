<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admin extends CI_Controller {

    public function __construct()
    {
        parent::__construct();
        ENVIRONMENT == 'development'
            ? $this->output->enable_profiler(TRUE) : TRUE;
        $this->authenticate->check_for_auth();
        $this->dso->admin_page_class = 'active';
        if (!$this->dso->is_admin)
        {
            redirect('main/error/access');
        }
    }

    public function index()
    {
        $this->load->model('Forum_model');

        $this->dso->page_title = 'Campfire';

        show_view('client/admin', $this->dso->all);
    }
}
