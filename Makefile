.PHONY: test
include .env
export

IMAGE_NAME=${CI_REGISTRY}/${ORGANIZATION}/${PATH_TO_PROJECT}/${PATH_TO_PROJECT}:${CI_ENVIRONMENT_SLUG}-${CI_COMMIT_SHA}

all: down build up

up:
	docker compose --profile prod up -d

down:
	docker compose --profile prod down

build:
	docker compose --profile prod build

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
	docker compose exec -it app-server bash

lint:
	npm run lint

migrate:
	npx prisma migrate dev

test:
	npm run test

e2e:
	npm run test:e2e

watch:
	npm run test:watch
