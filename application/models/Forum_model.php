<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Forum_model extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
    }
    
    public function get($forum_id, $enforce_active_section=TRUE)
    {
        // TODO: Determine use of these next few lines.
        if ($enforce_active_section)
        {
            $this->db->version = $this->session->version;
        }
        $this->db->where('id', $forum_id);
        $forum = cfr('Forum', 'row');
        return $forum;
    }

    public function get_all()
    {
        return $this->get_list();
    }

    public function get_for_section($section_id)
    {
        $this->load->model('Section_model');
        $section = $this->Section_model->get($section_id);
        if ($section)
        {
            return $this->get_for_version($section->versionID);
        }
        return array();
    }

    public function get_for_version($version_id)
    {
        $this->db->where('version', $version_id);
        return $this->get_list();
    }

    public function get_list()
    {
        $forums = cfr('Forum');
        return $forums;
    }

    public function get_score_data($forum_id, $enforce_active_section=TRUE)
    {
        if ($enforce_active_section)
        {
            $section = $this->session->section;
        }

        $sql = 'SELECT personID, firstName, lastName,
                SUM(score) AS score_sum,
                COUNT(id) AS post_num,
                ROUND(SUM(forum_points), 2) AS forum_points_ttl,
                IF (
                    SUM(forum_points)>Post_Score_Data.forum_max_points,
                    Post_Score_Data.forum_max_points,
                    ROUND(SUM(forum_points), 2)
                ) AS forum_points_ttl_cap 
            FROM post_score_data ';
        $sql .= "WHERE section = {$section} AND forum = {$forum_id} ";
        $sql .= 'GROUP BY personID';

        $query = $this->db->query($sql);

        $result = $query->result();

        return $result;

    }

    public function save($forum_id, $data)
    {
        if ($forum_id > 0)
        {
            $this->db->where('id', $forum_id);
            $this->db->update('Forum', $data);
        }
        else
        {
            $this->db->insert('Forum', $data);
            $forum_id = $this->db->insert_id();
        }

        return $this->get($forum_id, FALSE);
    }

    public function delete($forum_id)
    {
        if ($forum_id)
        {
            $this->db->where('id', $forum_id);
            $this->db->delete('Forum');
        }
    }
}