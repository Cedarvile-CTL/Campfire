-- --------

CREATE OR REPLACE VIEW Warehouse_Course AS 
	SELECT * 
	FROM warehouse.Course;
	
-- SELECT * FROM Warehouse_Course ORDER BY dptCode ASC, number ASC;

-- --------


CREATE OR REPLACE VIEW Thorin_Section AS
	SELECT d.*,
	   CONCAT(d.dptCode, d.number, '/', d.year, d.semesterID, LPAD(d.sectionNumber, 2, '0')) AS `section_uri`
	FROM Thorin.Section_Details as d;

-- --------


CREATE OR REPLACE VIEW Thorin_Version AS
	SELECT v.*,
	  (SELECT COUNT(id) FROM Forum WHERE course_version = v.versionID) AS `num_forums`
	FROM Thorin.Course_Version_Info as v;

-- --------


CREATE OR REPLACE VIEW Warehouse_Person AS 
    SELECT warehouse.Person.redwoodID as personID, 
        warehouse.Person.firstName, 
        warehouse.Person.lastName, 
        warehouse.Person.username, 
        warehouse.Person.email 
    FROM warehouse.Person;

-- SELECT * FROM Warehouse_Person ORDER BY lastName ASC, firstName ASC;

-- --------


CREATE OR REPLACE VIEW User_Info AS
    SELECT Warehouse_Person.*,
        User.access_level,
        Access_Level.name as access_level_name,
        Access_Level.`order` as access_level_order
    FROM User
JOIN Warehouse_Person ON User.id = Warehouse_Person.personID
JOIN Access_Level ON User.access_level = Access_Level.id;


CREATE OR REPLACE VIEW Post_Details AS
  SELECT * FROM Post
    JOIN Person_Info ON Post.user = Person_Info.personID;