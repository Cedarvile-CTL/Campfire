<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Version_model extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function get($version_id)
    {
        $this->db->where('versionID', $version_id);
        $version = cfr('Thorin_Version', 'row');

        return $version;
    }

    public function get_all()
    {
        $this->db->order_by('courseCode');
        $this->db->order_by('name');
        $versions = $this->get_list();

        $this->get_forums($versions);

        return $versions;
    }

    public function get_list()
    {
        // Get all course versions so as to edit forums therein
        $versions = cfr('Thorin_Version');
        return $versions;
    }

    public function get_forums(&$versions)
    {
        $this->load->model('Forum_model');
        $forums = $this->Forum_model->get_list();

        if ($versions)
        {
            foreach ($versions as &$version)
            {
                $version_forums = array();
                if (!empty($forums))
                {
                    foreach ($forums as $forum)
                    {
                        if ($forum->version == $version->versionID)
                        {
                            $version_forums[] = $forum;
                        }
                    }
                }
                $version->forums = $version_forums;
                $version->has_forums = count($version_forums) > 0 ? TRUE : FALSE;
                $version->has_no_forums = !$version->has_forums;
            }
        }
    }
}