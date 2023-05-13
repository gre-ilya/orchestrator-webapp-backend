.PHONY: test

all: down build up

up:
	docker compose -f docker-compose.local.yml --profile prod up -d

down:
	docker compose -f docker-compose.local.yml --profile prod down

build:
	docker compose -f docker-compose.local.yml --profile prod build

all-test: down-test build-test up-test

up-test:
	docker compose --profile test up -d

down-test:
	docker compose --profile test down

build-test:
	docker compose --profile test build

build-ci-cd:
	docker build -t ${IMAGE_NAME}

push-ci-cd:
	docker push ${IMAGE_NAME}

pull-ci-cd:
	docker pull ${IMAGE_NAME}

test-ci-cd:
	docker-compose exec -T app-server npm run test

server:
	nest start

dev:
	npm start

shell:
	docker compose -f docker-compose.local.yml exec -it app-server bash

lint:
	npm run lint

migrate:
	npx prisma migrate dev

test:
	npm run test

e2e:
	npm run test:e2e -- user
	npm run test:e2e -- project
	npm run test:e2e -- service

watch:
	npm run test:watch
