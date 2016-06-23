<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once("application/controllers/api/Main.php");

class Scale extends Main {

    public function __construct()
    {
        parent::__construct();
        $this->load->model('Scale_model');
    }

    public function index()
    {
        $this->_output_result("Thread Ready for requests");
    }

    public function all()
    {
        $scales = $this->Scale_model->get_all();
        $this->_output_result($scales);
    }

    public function all_for_version($version_id)
    {
        $scales = $this->Scale_model->get_for_version($version_id);
        $this->_output_result($scales);
    }

    public function get($scale_id)
    {
        $scale = $this->Scale_model->get($scale_id);
        $this->_output_result($scale);
    }

    public function save($scale_id=0)
    {
        $postdata = file_get_contents("php://input");
        $request = (array) json_decode($postdata);
        $scale = $this->Scale_model->save($scale_id, $request);

        $this->_output_result($scale);
    }

    public function delete($scale_id)
    {
        $this->Scale_model->delete($scale_id);
        $this->_output_result("");
    }
}