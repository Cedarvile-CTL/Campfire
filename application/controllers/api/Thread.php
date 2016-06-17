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
        $thread = $this->Thread_model->get($thread_id);
        if ($thread)
        {
            $thread->posts = $this->get_posts($thread_id, TRUE);
        }
        $this->_output_result($thread);
    }

    public function get_posts($thread_id, $return_object=FALSE)
    {
        $this->load->model('Post_model');

        $posts = $this->Post_model->get_for_thread($thread_id);
        $this->Post_model->subordinate_posts($posts);

        if ($return_object)
        {
            return $posts;
        }

        $this->_output_result($posts);
    }

    public function save($thread_id=0)
    {
        $postdata = file_get_contents("php://input");
        $request = (array) json_decode($postdata);
        $thread = $this->Thread_model->save($thread_id, $request);

        $this->_output_result($thread);
    }
}