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

    public function subordinate_posts(&$posts)
    {
        $grouped_posts = array();
        if (!empty($posts))
        {
            // First group the posts by parent
            foreach ($posts as $post)
            {
                // If the post has no parent add it to first index
                if ($post->parent == NULL)
                {
                    $grouped_posts[0][] = $post;
                    continue;
                }
                // Otherwise add it to an index that matches its parent
                $grouped_posts[$post->parent][] = $post;
            }
            // Next loop through unparented list and begin to subordinate
            $this->_load_child_posts($grouped_posts[0], $grouped_posts);
        }
        if (!empty($grouped_posts[0]))
        {
            $posts = $grouped_posts[0];
        }
    }

    private function _load_child_posts(&$root_list, $full_list)
    {
        if (!empty($root_list)) {
            foreach ($root_list as &$post) {
                if (array_key_exists($post->id, $full_list)) {
                    $post->posts = $full_list[$post->id];
                    $this->_load_child_posts($post->posts, $full_list);
                }
            }
        }
    }
}