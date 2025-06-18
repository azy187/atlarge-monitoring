# atlarge.monitoring monorepo

## Brief anatomy

| app | role |
| --- | --- |
| apps/api/v1 | Files for the Express server with endpoint at `api/v1/data`. Currently all this does when accessed is query the db for the test history data and returns it to the client in the response. |
| apps/web    | Contains static web files.<br>`index.js` fetches test data from the express endpoint and populates `index.html` with that data.|
| apps/e2e |  This app contains all of the playwright dependencies, the  playwright.config, and the scripts used to execute the tests and parse the results.<br>The parsed results are inserted into the postgres database. the script `scripts/test-runner.ts` is intended the entrypoint task for cron and can be started by running `npm run e2e:run` from the project root.<br>All project test specs should be stored in `/tests/`. |

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

install pm2:

```sh
sudo npm install pm2 -g
```

check everything installed and is running:

```sh
sudo service postgresql status
sudo service nginx status
pm2 --version
```

## 2. setup repo

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

build all files:

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
sudo -u postgres psql -d database -f /tmp/init_schema.sql

```

configure nginx reverse proxy:

```sh
sudo cp ./atlarge-monitoring/deploy/nginx.conf /etc/nginx/sites-available/myapp
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 5. api

start or stop the backend server using pm2:

```sh
npm run server:start
npm run server:stop
```

## 6. run tests
run all the e2e tests with:
```sh
npm run e2e:run
```
