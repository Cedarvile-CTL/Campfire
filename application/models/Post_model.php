<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Post_model extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function get($post_id)
    {
        $this->db->where('id', $post_id);
        $post = cfr('Post', 'row');
        return $post;
    }

    public function get_for_thread($thread_id)
    {
        $this->db->where('thread', $thread_id);
        return $this->get_list();
    }

    public function get_for_user($user_id, $thread_id=NULL, $forum_id=NULL, $section_id=NULL)
    {
        $this->db->where('user', $user_id);

        if ($thread_id !== NULL)
        {
            $this->db->where('thread', $thread_id);
        }

        if ($forum_id !== NULL)
        {
            $this->db->where('forum', $forum_id);
        }

        if ($section_id !== NULL)
        {
            $this->db->where('section', $section_id);
        }

        return $this->get_list();
    }

    public function get_list()
    {
        $posts = cfr('Post');
        return $posts;
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
                case 'alphabetical-by-user':
                    $this->db->order_by('user', 'asc');
                    break;
                case 'chronological':
                    $this->db->order_by('date_posted', 'asc');
                    break;
                case 'reverse-chronological':
                default:
                    $this->db->order_by('date_posted', 'desc');
                    break;

            }
        }
    }
}