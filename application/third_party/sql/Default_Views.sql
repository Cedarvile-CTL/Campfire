-- --------

CREATE OR REPLACE VIEW Warehouse_Course AS 
	SELECT * 
	FROM warehouse.Course;
	
-- SELECT * FROM Warehouse_Course ORDER BY dptCode ASC, number ASC;

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

CREATE OR REPLACE VIEW `Academic_Role` AS 
select `warehouse`.`Academic_Role`.`ID` AS `ID`,
        `warehouse`.`Academic_Role`.`name` AS `name` 
from `warehouse`.`Academic_Role`;

-- --------

CREATE OR REPLACE VIEW Person_Info AS
    SELECT Warehouse_Person.*, 
        User.accessLevelID,
        Access_Level.name as accessLevelName, 
        Access_Level.`order` as accessLevelOrder 
    FROM User 
NATURAL JOIN Warehouse_Person 
NATURAL JOIN Access_Level; 