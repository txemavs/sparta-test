THIS_FILE := $(lastword $(MAKEFILE_LIST))

.PHONY: up 
up:
	docker-compose -f docker-compose.yml up -d --build $(c)


.PHONY: dev 
dev:
	docker-compose -f development.yml up -d --build  $(c)


.PHONY: start 
start:
	docker-compose -f docker-compose.yml start $(c)

.PHONY: down 
down:
	docker-compose -f docker-compose.yml down $(c)

.PHONY: destroy 
destroy:
	docker-compose -f docker-compose.yml down -v $(c)

.PHONY: stop 
stop:
	docker-compose -f docker-compose.yml stop $(c)

.PHONY: restart 
restart:
	docker-compose -f docker-compose.yml stop $(c)
	docker-compose -f docker-compose.yml up -d $(c)

.PHONY: logs 
logs:
	docker-compose -f docker-compose.yml logs -f $(c)

.PHONY: ps 
ps:
	docker-compose -f docker-compose.yml ps

.PHONY: login 
login:
	docker-compose -f docker-compose.yml exec wsgi /bin/bash

.PHONY: shell 
shell:
	docker-compose -f docker-compose.yml exec wsgi manage.py shell

.PHONY: psql 
psql:
	docker-compose -f docker-compose.yml exec db psql -Utools