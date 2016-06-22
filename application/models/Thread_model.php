<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Thread_model extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function delete($thread_id)
    {
        $this->db->where('id', $thread_id);
        $this->db->delete('Thread');
    }

    public function get($thread_id)
    {
        $this->db->where('id', $thread_id);
        $thread = cfr('Thread_details', 'row');
        $this->objectify($thread);
        return $thread;
    }

    public function get_all()
    {
        return $this->get_list();
    }

    public function get_for_forum($forum_id)
    {
        $this->db->order_by('label');
        $this->db->where('forum', $forum_id);
        return $this->get_list();
    }

    public function get_list()
    {
        $threads = cfr('Thread_details');

        foreach($threads as &$thread)
        {
            $this->objectify($thread);
        }

        return $threads;
    }

    public function objectify($thread)
    {
        $thread->scale = (object) array(
            'id' => $thread->scale,
            'label' => $thread->scale_label,
            'maxPoints' => $thread->max_points,
            'version' => $thread->version,
            'type' => (object) array(
                'id'=>$thread->scale_type,
                'label'=>$thread->scale_type_label
            )
        );
    }

    public function save($thread_id, $data)
    {
        if ($thread_id > 0)
        {
            $this->db->where('id', $thread_id);
            $this->db->update('Thread', $data);
        }
        else
        {
            $this->db->insert('Thread', $data);
            $thread_id = $this->db->insert_id();
        }

        return $this->get($thread_id);
    }

    public function sort($sort_terms)
    {
        $sort_term_array = explode(',', $sort_terms);
        if (empty($sort_term_array))
        {
            $sort_terms_array = [''];
        }
        foreach ($sort_terms_array as $term)
        {
            switch ($term)
            {
                case 'alphabetical':
                    $this->db->order_by('user', 'asc');
                    break;
                case 'in-reverse-order':
                    $this->db->order_by('order', 'desc');
                    break;
                case 'in-order':
                default:
                    $this->db->order_by('order', 'asc');
                    break;

            }
        }
    }
}