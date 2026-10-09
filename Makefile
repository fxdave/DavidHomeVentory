.ONESHELL: # keep cd -ed dirs
.SHELLFLAGS = -ec # stop a recipe at its first failing command

.PHONY: start stop update install prod-start prod-stop prod-update build build-back build-front build-front-apk install-front-apk

PROD_COMPOSE = docker-compose -f compose.prod.yml -f compose.prod.override.yml

start:
	docker-compose up -d --remove-orphans

stop:
	docker-compose down

update:
	git pull
	docker-compose stop
	docker-compose run --rm front npm i
	docker-compose run --rm back npm i
	docker-compose run --rm back npx prisma migrate dev
	make build
	make start

prod-start: compose.prod.override.yml
	$(PROD_COMPOSE) up -d --remove-orphans

prod-stop: compose.prod.override.yml
	$(PROD_COMPOSE) down

prod-update: compose.prod.override.yml
	git pull
	$(PROD_COMPOSE) stop
	docker-compose run --rm front npm i
	docker-compose run --rm back npm i
	docker-compose run --rm back sh -c "npx prisma migrate deploy && npx prisma generate"
	make build
	make prod-start

install: compose.prod.override.yml back/.env
	docker-compose run --rm front npm i
	docker-compose run --rm back npm i
	docker-compose run --rm back sh -c "npx prisma migrate deploy && npx prisma generate"
	make build

back/.env: | back/.env.example
	cp back/.env.example back/.env
	export REPLACE="\"$$(cat /dev/random | head -c 50 | base64)\""
	export ESCAPED_REPLACE=$$(printf '%s\n' "$$REPLACE" | sed -e 's/[\/&]/\\&/g')
	sed -i -e "s|JWT_SECRET=|JWT_SECRET=$${ESCAPED_REPLACE}|" back/.env

compose.prod.override.yml: | compose.prod.override.yml.sample
	cp compose.prod.override.yml.sample compose.prod.override.yml

build:
	make build-back
	make build-front

build-back:
	docker-compose run --rm back npm run build
	
build-front:
	docker-compose run --rm front sh -c "npx panda generate && npm run build"

build-front-apk: build-front
	cd front
	npx cap sync android
	cd android
	./gradlew assembleDebug
install-front-apk: build-front
	cd front
	npx cap sync android
	cd android
	./gradlew installDebug
