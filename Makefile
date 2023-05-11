.PHONY: test

all: down build up

up:
	docker compose --profile prod up -d

down:
	docker compose --profile prod down

build:
	docker compose --profile prod build

test: down-test build-test up-test

up-test:
	docker compose --profile test up -d

down-test:
	docker compose --profile test down

build-test:
	docker compose --profile test build

watch:
	npm run test:watch

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

test-run:
	npm run test

test-watch:
	npm run test:watch
