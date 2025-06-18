# atlarge.monitoring monorepo

Setting up the ubuntu server from scratch.

## 1. ubuntu server prerequisites

install apps:

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

install and start nginx:

```sh
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

check everything installed and is running:

```sh
sudo service postgresql status
sudo service nginx status
```

## 2. setup repo

install pm2:

```sh
sudo npm install pm2 -g
```

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
npx playwright install --with-deps chromium
cd ../../
```

## 3. build files

check all workspaces are configured properly:

```sh
npx turbo ls
```

build files:

```sh
npm run build:all
```

## 4. server config

create the postgres database and user:

```sh
sudo cp ./atlarge-monitoring/deploy/init_db_and_user.sql /tmp/
sudo -u postgres psql -f /tmp/init_db_and_user.sql

```

create the table for the test_history data:

```sh
sudo cp ./atlarge-monitoring/deploy/init_schema.sql /tmp/
sudo -u postgres psql -d database -f /tmp/init_db_and_user.sql

```

configure nginx reverse proxy:

```sh
sudo ln -s /home/ubuntu/atlarge-monitoring/deploy/nginx.conf /etc/nginx/sites-enabled/myapp
sudo nginx -t
sudo systemctl reload nginx
```

## 5. api

start or stop the backend server using pm2:

```sh
npm run server:start
npm run server:stop
```
