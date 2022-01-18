## Development

```
cd extension && yarn dev
cd api && yarn dev
```

## Authentication logic

`extension.ts` set up a temporary polka server to which the express server will redirect as authentication callback. `vscode.open` direct user to the express server `/auth/github` for authentication, when it is successful user is redirected to the polka server's dynamic route carrying their token, `TokenManager` set the token as global state.

## Authorization logic

1. `Sidebar.svelte` mounts and post message `get-token` to `SidebarProvider`

2. `SidebarProvider` receives `get-token` and then post message `token` back to `Sidebar.svelte` alongside with token value provided by `TokenManager.getToken()`

3. `Sidebar.svelte` receives `token`, send a request to the express server `/me` route to identify the user