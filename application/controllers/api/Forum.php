<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once("application/controllers/api/Main.php");

class Forum extends Main {

    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {
        $this->_output_result("Forum Ready for requests");
    }

    public function all_for_version($version_id)
    {
        $this->db->where('course_version', $version_id);
        $forums = cfr('Forum');
        $this->_output_result($forums);
    }
}