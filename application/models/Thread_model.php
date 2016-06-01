<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Thread_model extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function get($thread_id)
    {
        $thread = cfr('Thread', 'row');
        return $thread;
    }

    public function get_all()
    {
        return $this->get_list();
    }

    public function get_for_forum($forum_id)
    {
        $this->db->where('forum', $forum_id);
        return $this->get_list();
    }

    public function get_list()
    {
        $threads = cfr('Thread');
        return $threads;
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