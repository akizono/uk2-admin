# Interface files

## Swagger API Files

This project uses Swagger to implement interactive interface files of RESTful API. Developers can intuitively view and test the specific definitions and usage methods of each API interface through the files.

### File access method

The Swagger file service is automatically enabled when each service starts.

If the backend service runs on ** port number 3022** (can be adjusted according to actual configuration), please access the corresponding interface file through the following URL:

```
http://localhost:3022/api-docs
```

:::tip
- Please replace the above URL according to the server port number (such as 3000, 3022 or other custom port) configured by the actual project`3022`

- Swagger is usually enabled in the development environment. Whether the production environment is open depends on the specific deployment settings.

- The file interface supports interactive functions such as interface parameter testing, response sample viewing, etc., which facilitates collaborative development between the front-end and the back-end.
:::
