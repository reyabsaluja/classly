-- Drop the existing foreign key constraint
ALTER TABLE students DROP CONSTRAINT IF EXISTS fk_students_group_id;

-- Add a more flexible foreign key constraint that allows NULL values
-- and handles cascading deletes properly
ALTER TABLE students 
ADD CONSTRAINT fk_students_group_id 
FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- Ensure any invalid group_id references are cleaned up
UPDATE students 
SET group_id = NULL 
WHERE group_id IS NOT NULL 
AND group_id NOT IN (SELECT id FROM groups);
