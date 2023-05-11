.PHONY: test

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
