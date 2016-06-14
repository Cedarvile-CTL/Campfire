<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once("application/controllers/api/Main.php");

class Version extends Main {

    public function __construct()
    {
        parent::__construct();
        $this->load->model('Version_model');
    }

    public function index()
    {
        $this->_output_result("Version api ready for requests");
    }

    public function all()
    {
        $versions = $this->Version_model->get_all();
        $this->_output_result($versions);
    }

    public function get($version_id)
    {
        $version = $this->Version_model->get($version_id);
        $this->_output_result($version);
    }
}