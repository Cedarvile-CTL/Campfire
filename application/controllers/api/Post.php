<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once("application/controllers/api/Main.php");

class Post extends Main {

    public function __construct()
    {
        parent::__construct();
        $this->load->model('Post_model');
    }

    public function index()
    {
        $this->_output_result("Post Ready for requests");
    }

    public function all_for_thread($thread_id)
    {
        // TODO: add model call
        $this->_output_result("");
    }

    public function all_for_user($user_id)
    {
        // TODO: add model call
        $this->_output_result("");
    }

    public function delete($post_id)
    {
        $this->Post_model->delete($post_id);
        $this->_output_result("");
    }

    public function get($post_id=0)
    {
        $post = $this->Post_model->get($post_id);
        if ($post)
        {
            // TODO: are child posts loaded too?
        }
        $this->_output_result($post);
    }

    public function save($post_id=0)
    {
        $postdata = file_get_contents("php://input");
        $request = (array) json_decode($postdata);
        $post = $this->Post_model->save($post_id, $request);
        
        $this->_output_result($post);
    }
}