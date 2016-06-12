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

        show_view('ng-view', $this->dso->all);
    }
    
    public function error($type)
    {
        switch($type)
        {
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
}
