<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Main extends CI_Controller {

    public function __construct() 
    {
        parent::__construct();
        ENVIRONMENT == 'development' 
            ? $this->output->enable_profiler(TRUE) : TRUE;
        $this->authenticate->check_for_auth();
        $this->dso->forums_page_class = 'active';
    }
    
    public function index($course=NULL, $section=NULL)
    {
        $this->dso->page_title = 'Campfire';
        if ($course===NULL || $section===NULL)
        {
            redirect(base_url('main/error/section'));
        }

        $this->load->model('Section_model');

        // Look up course and section
        $actual_section = $this->Section_model->get(NULL, $course . '/' . $section);
        if ($actual_section===NULL)
        {
            redirect(base_url('main/error/section'));
        }

        $this->session->section = $actual_section->sectionID;

        show_view('client/main', $this->dso->all);
    }

    public function forum($forum_id)
    {
        $this->_ensure_section_data();

        $this->dso->forum_id = $forum_id;
        show_view('client/forum/view', $this->dso->all);
    }
    
    public function error($type)
    {
        switch($type)
        {
            case 'access':
                $this->dso->msg = "<p>You do not have sufficient access level privileges to use this feature..</p>";
                $this->dso->actions = [
                    ['path'=>base_url('authenticate/logout'), 'label'=>'Logout of Campfire'],
                    ['path'=>'http://moodle.cedarville.edu', 'label'=>'Go to Moodle']
                ];
            case 'section':
            default:
                $this->dso->msg = "<p>You must link to campfire from a valid section of a course at Cedarville University. Contact your professor for help with this issue.</p>";
                $this->dso->actions = [
                    ['path'=>base_url('authenticate/logout'), 'label'=>'Logout of Campfire'],
                    ['path'=>'http://moodle.cedarville.edu', 'label'=>'Go to Moodle']
                ];
                break;
        }
        
        show_view('error', $this->dso->all);
    }

    private function _ensure_section_data()
    {
        if (!$this->session->section)
        {
            redirect(base_url('main/error/section'));
        }

//        ep('Section detected.');

        if (!$this->session->version)
        {
            $this->load->model('Section_model');
            $section = $this->Section_model->get($this->session->section);
            if (!$section)
            {
                redirect(base_url('main/error/section'));
            }
            $this->session->version = $section->versionID;
        }

//        ep('Version found for section.');
    }
}
