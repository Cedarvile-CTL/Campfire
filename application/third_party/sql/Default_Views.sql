-- --------

CREATE OR REPLACE VIEW Warehouse_Course AS 
	SELECT * 
	FROM warehouse.Course;
	
-- SELECT * FROM Warehouse_Course ORDER BY dptCode ASC, number ASC;

-- --------


CREATE OR REPLACE VIEW Thorin_Section AS
	SELECT *
	FROM Thorin.Section_Details;

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
    JOIN User_Info ON Post.user = User_Info.personID;