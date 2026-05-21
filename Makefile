.PHONY: research dev preview test build deploy

research:
	npm run build:research

dev: research
	npm run dev -- --host 127.0.0.1

preview:
	npm run dev:full

test:
	npm test

build:
	npm run build

deploy:
	npm run deploy:system
