<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Post_model extends CI_Model
{

    var $scale;
    var $read_posts;
    var $num_read_posts;
    var $num_posts;

    public function __construct()
    {
        parent::__construct();
        $this->scale = NULL;
        $this->read_posts = array();
        $this->num_read_posts = 0;
        $this->num_posts = 0;
    }
    
    public function delete($post_id)
    {
        $this->db->where('id', $post_id);
        $this->db->delete('Post');
    }

    public function get($post_id=0)
    {
        $this->load->model('Scale_model');

        $this->db->where('id', $post_id);
        $post = cfr('Post_Details', 'row');

        if ($post)
        {
            $this->scale = $this->Scale_model->get_for_thread($post->thread);
            $this->objectify($post);
        }

        return $post;
    }

    public function get_for_thread($thread_id, $enforce_active_section=TRUE)
    {
        // Get the thread's scale
        $this->load->model('Scale_model');
        $this->scale = $this->Scale_model->get_for_thread($thread_id);

        if ($enforce_active_section)
        {
            $this->db->where('section', $this->session->section);
        }
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
        $posts = cfr('Post_Details');

        $this->_load_read_posts();

        if (!empty($posts))
        {
            $this->load->model('user_model');
            foreach ($posts as &$post)
            {
                $this->objectify($post);
            }
        }

        $this->scale = NULL;

        $this->num_posts = count($posts);

        return $posts;
    }

    public function objectify(&$post)
    {
        $this->load->model('user_model');
        $post->user = $this->user_model->objectify($post);
        $post->scale = $this->scale ? $this->scale : NULL;
        $post->authorViewing = $this->session->user->id == $post->user->id;
        if ($post->scale)
        {
            $post->scale->authorViewing = $post->authorViewing;
        }
        $post->isNew = TRUE;
        if (!empty($this->read_posts))
        {
            $post->isNew = ! in_array($post->id, $this->read_posts);
        }
    }

    public function sort($sort_terms)
    {
        $sort_term_array = explode(',', $sort_terms);
        if (empty($sort_term_array))
        {
            $sort_terms_array = array('');
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

    public function save($post_id, $data, $enforce_active_section=TRUE)
    {
        if ($enforce_active_section)
        {
            $data['section'] = $this->session->section;
        }

        if ($post_id > 0)
        {
            $this->db->where('id', $post_id);
            $this->db->update('Post', $data);
        }
        else
        {
            $this->db->insert('Post', $data);
            $post_id = $this->db->insert_id();
        }
        
        return $this->get($post_id);
    }

    public function save_score($post_id, $score)
    {
        $this->load->model('Scale_model');
        
        // Ensure provide score is legitimate for this post and thread
        $post = $this->get($post_id);
        $scale = $this->Scale_model->get_for_thread($post->thread);
        if ($scale)
        {
            $score = $score <= $scale->max_points ? $score : $scale->max_points;
        }
        
        // Store data
        $data = array(
            'score'=>$score,
            'date_scored'=> date(SERVER_DATE_STR),
            'grader'=>$this->session->user->id
        );

        // Attempt to update first
        $this->db->where('post', $post_id);
        $this->db->update('Post_Score', $data);

        // If none were updated, add a score instead
        if ($this->db->affected_rows() < 1)
        {
            $data['post'] = $post_id;
            $this->db->insert('Post_Score', $data);
        }

        // Return the updated post
        return $this->get($post_id);
    }

    private function _load_read_posts()
    {
        $this->db->where('user', $this->session->user->id);
        $read_posts = cfr('Viewed_Post');
        $simple_posts = array();

        if (!empty($read_posts))
        {
            foreach ($read_posts as $post)
            {
                $simple_posts[] = $post->post;
            }
        }

        $this->read_posts = $simple_posts;
        $this->num_read_posts = count($this->read_posts);
    }
}