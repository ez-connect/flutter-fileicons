.PHONY: build

build:
	flutter build web -v --release --web-renderer html

deploy:
	surge build/web --domain https://fileicons.ez-connect.net
