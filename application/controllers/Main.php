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
    
    public function index($course=NULL, $section=NULL, $forum=NULL)
    {
        $this->dso->page_title = 'Campfire';
        if (!$this->session->section && ($course===NULL || $section===NULL))
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

        $this->_ensure_section_data(TRUE);
        $this->_get_user_role_for_view();

        // Check for a forum and redirect if necessary
        if ($forum !== NULL)
        {
            redirect(base_url('main/forum/' . $forum));
        }


        show_view('client/main', $this->dso->all);
    }

    public function forum($forum_id)
    {
        $this->_ensure_section_data();
        $this->_get_user_role_for_view();

        $this->dso->forum_id = $forum_id;
        show_view('client/forum/view', $this->dso->all);
    }

    public function forum_grades($forum_id)
    {
        $this->_ensure_section_data();
        $this->_get_user_role_for_view();

        if (! $this->dso->is_grader)
        {
            redirect(base_url('error/access'));
        }

        $this->load->model('Forum_model');

        $this->dso->forum_id = $forum_id;

        $this->dso->score_data = $this->Forum_model->get_score_data($forum_id);

        show_view('client/forum/view_grades', $this->dso->all);
    }
    
    public function error($type)
    {
        switch($type)
        {
            case 'access':
                $this->dso->msg = "<p>You do not have sufficient access level privileges to use this feature..</p>";
                $this->dso->actions = array(
                    array('path'=>base_url('authenticate/logout'), 'label'=>'Logout of Campfire'),
                    array('path'=>'http://moodle.cedarville.edu', 'label'=>'Go to Moodle')
                );
            case 'section':
            default:
                $this->dso->msg = "<p>You must link to campfire from a valid section of a course at Cedarville University. Contact your professor for help with this issue.</p>";
                $this->dso->actions = array(
                    array('path'=>base_url('authenticate/logout'), 'label'=>'Logout of Campfire'),
                    array('path'=>'http://moodle.cedarville.edu', 'label'=>'Go to Moodle')
                );
                break;
        }
        
        show_view('error', $this->dso->all);
    }

    private function _ensure_section_data($force_version_reload=FALSE)
    {
        // Ensure a section is stored in the session
        if (!$this->session->section)
        {
            redirect(base_url('main/error/section'));
        }

        // Ensure the correct course version is stored in the session
        if (!$this->session->version || $force_version_reload)
        {
            $this->load->model('Section_model');
            $section = $this->Section_model->get($this->session->section);
            if (!$section)
            {
                redirect(base_url('main/error/section'));
            }
            $this->session->version = $section->versionID;
        }

        // Get the user's role in this section
        $this->session->user->section_role = $this->user_model->get_role_in_section(
            $this->session->user->id,
            $this->session->section,
            TRUE
        );
    }

    private function _get_user_role_for_view()
    {
        $this->dso->user = $this->session->user;
        $this->dso->user_role = $this->session->user->section_role == ACADEMICROLE_PROF
            ? 'Professor'
            : ($this->session->user->section_role == ACADEMICROLE_TA
                || $this->session->user->accessLevel->id < ACCESSLEVEL_REGULAR
                ? 'Assistant'
                : 'Student/Participant');

        $this->dso->is_grader =
            $this->session->user->section_role > ACADEMICROLE_STU
            || $this->session->user->accessLevel->id < ACCESSLEVEL_REGULAR
            ? TRUE
            : FALSE;
    }
}
