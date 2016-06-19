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

        $this->session->user->section_role = NULL;
        $this->dso->user = $this->session->user;

        $this->_get_user_role_for_view();
    }

    public function index()
    {
        $this->dso->page_title = 'Campfire Administration';

        show_view('client/admin', $this->dso->all);
    }

    public function forum($forum_id)
    {
        $this->load->model('Forum_model');
        $this->dso->page_title = 'Manage Forum | Campfire Administration';
        $this->dso->forum = $this->Forum_model->get($forum_id, FALSE);
        show_view('client/forum/manage', $this->dso->all);
    }

    private function _get_user_role_for_view()
    {
        $this->dso->user_role = $this->session->user->accessLevel->id == ACCESSLEVEL_SUPERADMIN
            ? 'Super Admin'
            : ($this->session->user->accessLevel->id == ACCESSLEVEL_ADMIN
                ? 'Admin'
                : 'Regular Access');
    }
}
