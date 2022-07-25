#
# file-icons
# https://github.com/file-icons/icons
#

.PHONY: doc test build

# Environments
-include .makerc

# Service
NAME			= $(shell grep -oP 'name: \K\S+' .config/service.base.yaml)
VERSION			= $(shell grep -oP 'version: \K\S+' .config/service.base.yaml)
DESCRIPTION		= $(shell grep -oP 'description: \K.+' .config/service.base.yaml)
README			= $(shell grep -oP 'readme: \S+' .config/service.base.yaml)

# Lists all targets
help:
	@grep -B1 -E "^[a-zA-Z0-9_%-]+\:([^\=]|$$)" Makefile \
		| grep -v -- -- \
		| sed 'N;s/\n/###/' \
		| sed -n 's/^#: \(.*\)###\(.*\):.*/\2###\1/p' \
		| column -t -s '###'

#: Removes untracked files from the working tree
clean:
	flutter clean
	git clean -fdx

#: Install necessary packages
init:
	flutter pub global activate dartdoc

#: Code formatting
fmt:
	flutter format --fix lib/

#: Analyzes the project's Dart source code
lint:
	flutter analyze lib/

#: Validation the package  but does not actually upload the package
test:
	dart pub publish --dry-run

#: Genereate TTF from SVG
ttf:
ifeq ($(wildcard bin/tmp/icons-master),)
	mkdir -p bin/tmp
	curl -Lo bin/tmp/icons.zip https://github.com/file-icons/icons/archive/refs/heads/master.zip
	unzip bin/tmp/icons.zip -d bin/tmp/
endif
#	node bin/node_modules/svgtofont/lib/cli.js --sources bin/tmp/icons-master/svg --output=bin/tmp/fonts/ --fontName=FileIcons
#	cp bin/tmp/fonts/*.ttf assets/fonts/

	node bin/woff2-to-ttf.js bin/tmp/icons-master/dist/file-icons.woff2 assets/fonts/FileIcons.ttf

#: Generate source from IcoMoon css
gen:
#	node bin/css-to-dart.js bin/tmp/fonts/FileIcons.css lib/fileicons.dart
	node bin/css-to-dart.js bin/tmp/icons-master/icons.tsv lib/fileicons.dart
	@make -s fmt lint
