MAKEFLAGS = --no-print-directory --always-make --silent
MAKE = make $(MAKEFLAGS)

NODE_BIN = node_modules/.bin
NODEMON = $(NODE_BIN)/nodemon

.PHONY: \
	build \
	dev-client server \
	check lint test-client \
	deploy

build:
	@echo "Building project..."
	npm run-script build

dev-client:
	@echo "Starting client dev-server..."
	npm start

server:
	@echo "Starting server dev-server..."
	$(NODEMON) src/server/index.js

check:
	$(MAKE) lint
	$(MAKE) test-client
	@echo "Hooray! -- All checks pass"

lint:
	@echo "Running eslint..."
	$(NODE_BIN)/eslint --ext .js --ext .jsx src

test-client:
	@echo "Running client test suite..."
	CI=true npm test

deploy:
	@echo "Deploying to heroku..."
	$(MAKE) check
	git push heroku master
