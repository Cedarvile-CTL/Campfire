<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once("application/controllers/api/Main.php");

class User extends Main {

    public function __construct()
    {
        parent::__construct();
        $this->load->model('User_model');
    }

    public function index()
    {
        $this->_output_result("Forum Ready for requests");
    }

    public function get_active()
    {
        $result = $this->session->user;
        $this->_output_result($result);
    }
}