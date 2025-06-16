<h1 style="text-align:center;text-decoration:underline">
  atlarge.monitoring monorepo
</h1>
<hr />
<div style="display:flex;align-items:center;justify-content:center;">
  <div>
    <table>
      <tr>
        <td colspan="3" style="text-align:center">brief anatomy of each workspace</td>
      </tr>
      <tr>
        <th style="text-decoration:underline">workspace</th>
        <th style="text-decoration:underline">key files</th>
        <th style="text-decoration:underline;width:600px">purpose</th>
      </tr>
      <tr>
        <th>api/v1</th>
          <td>
            <code>dist/main.js</code>
          </td>
          <td>
            express server with an endpoint to query the db for the parsed data and send it in the response to the client
          </td>
      </tr>
      <tr>
        <th rowspan="5">e2e</th>
          <tr>
            <td>
              <code>tests</code>
            </td>
            <td>
              directory that playwright will search for test specs, consisting of subfolders for each project's test specs i.e <code>monitoring/tests/internalProjectName/*.spec.ts</code><br>
              (will likely revise this approach ITF)
            </td>
          </tr>
          <tr>
            <td>
              <code>dist/runner.js</code>
            </td>
            <td>
              app scheduled by cron that handles each task involved in the testing process synchronously: instructs playwright to execute all tests and produce a result after some indeterminate time; parses the result; and inserts the parsed result into the db
            </td>
          </tr>
          <tr>
            <td>
              <code>dist/util/parser.js</code>
            </td>
            <td>
              Parses the JSON outputted by playwright and inserts it into the db
            </td>
          </tr>
          <tr>
            <td>
              <code>node_modules/playwright</code>
            </td>
            <td>
              playwright & browser project dependencies required to run the e2e tests
            </td>
          </tr>
      </tr>
      <tr>
        <th>web</th>
          <td>
            <code>dist/index.js</code><br>
            <code>index.html</code>
          </td>
          <td>
            frontend files for fetching and displaying the parsed data 
          </td>
      </tr>
    </table>

  </div>
</div>

server:

1. postgres db on ubuntu server.
2. stores parsed results as jsonb

ref:

- [postgres JSONB](https://www.freecodecamp.org/news/postgresql-and-json-use-json-data-in-postgresql/)
- [ubuntu w/ nodejs setup](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-22-04)
- [ws for node](https://github.com/websockets/ws?tab=readme-ov-file#sending-and-receiving-text-data)
- [ws server & client](https://medium.com/@leomofthings/building-a-node-js-websocket-server-a-practical-guide-b164902a0c99)
