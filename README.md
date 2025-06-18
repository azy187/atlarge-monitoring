# atlarge.monitoring monorepo

## setup repo

clone the repo:

```sh
git clone git@github.com:azy187/atlarge-monitoring.git
cd atlarge-monitoring/
```

install dependencies:

```sh
npm i
npm i turbo -D
```

create .env from example:

```sh
npm run _env
```

install playwright and chromium dependencies:

```sh
cd apps/e2e
npx install playwright chromium
```

check all workspaces are configured properly:

```sh
turbo ls
```

build the static files:

```sh
turbo build:web
```

build packages and start the api server:

```sh
turbo start:api
```

## setup server

cd to the home directory.

install prerequisites:

```sh
sudo apt update && sudo apt upgrade -y
sudo apt install curl gnupg build-essential -y
```

install node:

```sh
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
```

install and start postgres:

```sh
sudo apt install postgresql postgresql-contrib -y
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

setup user, database, table:

```sh
sudo -u postgres psql -f atlarge-monitoring/deploy/init_db.sql

```

install and start nginx:

```sh
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

configure nginx reverse proxy:

```sh
sudo ln -s /home/ubuntu/atlarge-monitoring/deploy/nginx.conf /etc/nginx/sites-enabled/myapp
sudo nginx -t
sudo systemctl reload nginx
```
