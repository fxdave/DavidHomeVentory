run-dev:
	docker-compose up -d --remove-orphans

run-prod:
	docker-compose -f compose.prod.yml up -d --remove-orphans

stop:
	docker-compose down

install:
	docker-compose run front npm i

build:
	make build-back
	make build-front

build-back:
	docker-compose run back cargo build --release
	
build-front:
	docker-compose run front npm run build