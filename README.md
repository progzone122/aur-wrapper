# AUR TypeScript Wrapper
A simple wrapper for RPC API and RSS for AUR (Arch User Repository)

## Configuration
Configure the wrapper instance before using it.

| Argument | Description                                                                    | Type    | Default                   |
|----------|--------------------------------------------------------------------------------|---------|---------------------------|
| baseUrl  | Domain for all requests to AUR                                                 | string  | https://aur.archlinux.org |
| proxy    | Proxies all requests through the [corsproxy.io](https://corsproxy.io) service  | boolean | false                     |

### Server-side
If you are using the library on the server side, no configuration is required.
```ts
let wrapper: AurWebWrapper = new AurWebWrapper({});
```

### Client-side
If you want to send requests on the client side and bypass CORS. Configure the use of proxy.
```ts
let wrapper: AurWebWrapper = new AurWebWrapper({
    proxy: true
});
```