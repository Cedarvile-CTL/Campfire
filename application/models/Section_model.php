<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Section_model extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function get($section_id=NULL, $section_uri_str=NULL)
    {
        $section = NULL;
        if ($section_id !==NULL)
        {
            $this->db->where('sectionID', $section_id);
            $section = cfr('Thorin_Section', 'row');
        }
        elseif ($section_uri_str !== NULL)
        {
            $this->db->where('section_uri', strtoupper($section_uri_str));
            $section = cfr('Thorin_Section', 'row');
        }

        return $section;
    }

//    public function get_all()
//    {
//        return $this->get_list();
//    }
//
//    public function get_for_version($version_id)
//    {
//        $this->db->where('course_version', $version_id);
//        return $this->get_list();
//    }
//
//    public function get_list()
//    {
//        $forums = cfr('Forum');
//        return $forums;
//    }
}