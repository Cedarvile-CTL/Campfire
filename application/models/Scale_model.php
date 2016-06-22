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
        $thread = $this->Thread_model->get($thread_id);
        $scale = false;
        if ($thread)
        {
            $scale = $this->get($thread->scale);
        }

        return $scale;
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
                $scale->items;
            }
        }
        return $scales;
    }

    public function objectify(&$scale)
    {
        
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