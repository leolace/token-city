.PHONY: start stop seed

start:
	docker-compose up --build

stop:
	docker-compose down

seed:
	docker-compose exec -T db psql -U postgres -d projeto_bd < seed.sql

clear:
	sudo docker compose down -v