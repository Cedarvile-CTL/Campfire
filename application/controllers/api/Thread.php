<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once("application/controllers/api/Main.php");

class Thread extends Main {

    public function __construct()
    {
        parent::__construct();
        $this->load->model('Thread_model');
    }

    public function index()
    {
        $this->_output_result("Thread Ready for requests");
    }

    public function all()
    {
        $threads = $this->Thread_model->get_all();
        $this->_output_result($threads);
    }

    public function all_for_forum($forum_id)
    {
        $forums = $this->Thread_model->get_for_forum($forum_id);
        $this->_output_result($forums);
    }

    public function get($thread_id)
    {
        $this->load->model('Post_model');

        $thread = $this->Thread_model->get($thread_id);
        if ($thread)
        {
            $thread->posts = $this->Post_model->get_for_thread($thread_id);
            $this->Post_model->subordinate_posts($thread->posts);
        }
        $this->_output_result($thread);
    }
}