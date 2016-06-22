<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Main extends CI_Controller {

    public function __construct()
    {
        parent::__construct();

        if (FALSE)
        {
            ENVIRONMENT == 'development'
                    ? $this->output->enable_profiler(TRUE) : TRUE;
        }

        $this->authenticate->check_for_auth();

        if (!$this->dso->is_admin)
        {
            if (!$this->session->section)
            {
                redirect(base_url('api/main/error/section'));
            }

            if (!$this->session->version)
            {
                $this->load->model('Section_model');
                $section = $this->Section_model->get($this->session->section);
                if (!$section)
                {
                    redirect(base_url('api/main/error/section'));
                }
                $this->session->version = $section->versionID;
            }
        }
        
        // Get the user's role in this section
        $this->session->user->section_role = $this->user_model->get_role_in_section(
            $this->session->user->id,
            $this->session->section,
            TRUE
        );
    }

    public function index()
    {
        $this->_output_result("API Ready for requests");
    }

    public function error($type)
    {
        $msg = stdClass();
        switch ($type)
        {
            case 'section':
            default:
                $msg->error = "Invalid section";
                break;
        }
        $this->_output_result($msg);
    }

    protected function _output_result($result)
    {
        $result = json_encode($result);
        $this->output->append_output($result);
    }
}
