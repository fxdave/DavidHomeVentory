.ONESHELL: # keep cd -ed dirs

run-dev:
	docker-compose up -d --remove-orphans

run-prod:
	docker-compose -f compose.prod.yml up -d --remove-orphans

stop:
	docker-compose down

install:
	cp back/.env.example back/.env
	export REPLACE="\"$$(cat /dev/random | head -c 50 | base64)\""
	export ESCAPED_REPLACE=$$(printf '%s\n' "$$REPLACE" | sed -e 's/[\/&]/\\&/g')
	sed -i -e "s|JWT_SECRET=|JWT_SECRET=$${ESCAPED_REPLACE}|" back/.env
	docker-compose run front npm i
	docker-compose run back npm i
	docker-compose run back npx prisma migrate dev
	make build

build:
	make build-back
	make build-front

build-back:
	docker-compose run back npm run build
	
build-front:
	docker-compose run front npm run build

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