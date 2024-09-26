lint-frontend:
	make -C frontend lint

install:
	npm ci

start-frontend:
	make -C frontend start

start-backend:
	npx start

deploy:
	git push heroku main

start:
	npm start

develop:
	make start-backend & make start-frontend

build:
	rm -rf frontend/build
	npm run build