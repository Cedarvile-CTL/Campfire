<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Main extends CI_Controller {

    public function __construct()
    {
        parent::__construct();
        ENVIRONMENT == 'development'
            ? $this->output->enable_profiler(TRUE) : TRUE;
        #$this->authenticate->check_for_auth();
    }

    public function index()
    {
        $this->_output_result("API Ready for requests");
    }

    protected function _output_result($result)
    {
        $result = json_encode($result);
        $this->output->append_output($result);
    }
}
