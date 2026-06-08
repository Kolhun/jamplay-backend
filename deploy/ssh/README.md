# Deploy SSH key

Place a GitHub deploy key (read-only) here:

```
deploy/ssh/github_deploy_key
```

```bash
chmod 600 deploy/ssh/github_deploy_key
```

This single key is used by all `./rebuild` scripts (`deploy/web`, `deploy/admin`, `deploy/nginx`).

Do not commit the key file to Git.
