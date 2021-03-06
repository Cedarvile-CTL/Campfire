<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Scale_model extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function get($scale_id=0)
    {
        $this->db->where('id', $scale_id);
        $scale = cfr('Scale_details', 'row');

        if ($scale)
        {
            $this->objectify($scale);
        }

        return $scale;
    }

    public function get_for_thread($thread_id)
    {
        $this->load->model('Thread_model');
        $thread = $this->Thread_model->get($thread_id);
        $scale = false;
        if ($thread)
        {
            $scale = $this->get($thread->scale->id);
        }

        return $scale;
    }

    public function get_all()
    {
        return $this->get_list();
    }

    public function get_for_version($version_id)
    {
        $this->db->where('version', $version_id);
        return $this->get_list();
    }

    public function get_list()
    {
        $scales = cfr('Scale_details');
        if (!empty($scales))
        {
            // Load all the scale items
            foreach ($scales as &$scale)
            {
                // Map items to each corresponding scale
                $this->objectify($scale);
                $scale->items = array();
            }
        }
        return $scales;
    }

    public function objectify(&$scale)
    {
        $scale->maxPoints = $scale->max_points;
        $scale->type = (object) array(
            'id'=>$scale->scale_type,
            'label'=>$scale->scale_type_label
        );
        $scale->graderViewing =
            $this->session->user->section_role >= ACADEMICROLE_TA
            || $this->session->user->accessLevel->id <= ACCESSLEVEL_ADMIN;
        $scale->authorViewing = FALSE; // TO BE SET AT POST LEVEL
    }

    public function save($scale_id, $data)
    {
        if ($scale_id > 0)
        {
            $this->db->where('id', $scale_id);
            $this->db->update('Scale', $data);
        }
        else
        {
            $this->db->insert('Scale', $data);
            $scale_id = $this->db->insert_id();
        }

        return $this->get($scale_id);
    }
}