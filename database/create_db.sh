docker run --name aedion_tasks -p 5433:5432 -e POSTGRES_USER=suonica -e POSTGRES_PASSWORD=ashryver -e POSTGRES_DB=aedion_tasks -d postgres

psql -h 127.0.0.1 -p 5433 -d aedion_tasks -U suonica -f database/fill_db.sql
