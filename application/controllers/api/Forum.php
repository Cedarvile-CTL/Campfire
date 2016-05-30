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

    public function get_all()
    {
        $forums = [
            (object)[
                "id"=>1,
                "label"=>"Forum 1",
                "description"=>"Test forum 1",
                "max_points"=>10,
            ],
            (object)[
                "id"=>2,
                "label"=>"Forum 2",
                "description"=>"Test forum 2",
                "max_points"=>10,
            ]
        ];
        $this->_output_result($forums);
    }
}