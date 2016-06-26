
CREATE OR REPLACE VIEW Warehouse_Course AS 
	SELECT * 
	FROM warehouse.Course;

-- --------

CREATE OR REPLACE VIEW Warehouse_Roles AS
  SELECT *
  FROM warehouse.Academic_Role;

-- --------

CREATE OR REPLACE VIEW Thorin_Section AS
	SELECT d.*,
	   CONCAT(d.dptCode, d.number, '/', d.year, d.semesterID, LPAD(d.sectionNumber, 2, '0')) AS `section_uri`
	FROM thorin.Section_Details as d;

-- --------

CREATE OR REPLACE VIEW Thorin_Version AS
	SELECT v.*,
	  (SELECT COUNT(id) FROM Forum WHERE version = v.versionID) AS `num_forums`
	FROM thorin.Course_Version_Info as v;

-- --------

CREATE OR REPLACE VIEW User_IN_Section AS
	SELECT thorin.Person_IN_Section.personID AS `user`,
	  thorin.Person_IN_Section.sectionID AS `section`,
	  thorin.Person_IN_Section.roleID AS `role`
	FROM thorin.Person_IN_Section;

-- --------

CREATE OR REPLACE VIEW Warehouse_Person AS 
    SELECT warehouse.Person.redwoodID as personID, 
        warehouse.Person.firstName, 
        warehouse.Person.lastName, 
        warehouse.Person.username, 
        warehouse.Person.email 
    FROM warehouse.Person;

-- --------

CREATE OR REPLACE VIEW Person_Info AS
    SELECT Warehouse_Person.*,
        User.access_level,
        Access_Level.name as access_level_name,
        Access_Level.`order` as access_level_order
    FROM User
JOIN Warehouse_Person ON User.id = Warehouse_Person.personID
JOIN Access_Level ON User.access_level = Access_Level.id;

-- --------

CREATE OR REPLACE VIEW Post_Details AS
  SELECT Post.*,
    Person_Info.*,
    Post_Score.score,
    Post_Score.grader,
    Post_Score.date_scored

  FROM Post
    JOIN Person_Info ON Post.user = Person_Info.personID
    LEFT JOIN Post_Score ON Post.id = Post_Score.post;

-- --------

CREATE OR REPLACE VIEW Thread_Details AS
  SELECT Thread.*,
    Scale.scale_type,
    Scale.label as scale_label,
    Scale.description as scale_description,
    Scale.max_points,
    Scale_Type.label as scale_type_label,
    Forum.version

  FROM Thread
    JOIN Forum ON Thread.forum = Forum.id
    LEFT JOIN Scale ON Thread.scale = Scale.id
    LEFT JOIN Scale_Type ON Scale.scale_type = Scale_Type.id;

-- --------

CREATE OR REPLACE VIEW Scale_Details AS
  SELECT Scale.*,
    Scale_Type.label as scale_type_label

  FROM Scale
    JOIN Scale_Type ON Scale.scale_type = Scale_Type.id;

-- --------

CREATE OR REPLACE VIEW Post_Score_Data AS
  SELECT Post.id,
    Person_Info.*,
    Post.thread, Thread.forum, Post.section,
    Post_Score.score, Scale.max_points,
    (Post_Score.score/Scale.max_points * 100) AS score_perc,
    Forum.num_posts,
    Forum.max_points as forum_max_points,
    (1/Forum.num_posts) * (Post_Score.score/Scale.max_points) AS forum_posts_perc,
    (1/Forum.num_posts) * (Post_Score.score/Scale.max_points) * Forum.max_points AS forum_points
  FROM Post
    JOIN Person_Info ON Post.user = Person_Info.personID
    JOIN Thread ON Post.thread = Thread.id
    JOIN Forum ON Thread.forum = Forum.id
    JOIN Post_Score ON Post.id = Post_Score.post
    JOIN Scale ON Thread.scale = Scale.id;

-- SELECT * FROM Post_Score_Data;