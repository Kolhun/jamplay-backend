# Deploy SSH key

Place a GitHub deploy key (read-only) here:

```
ssh/github_deploy_key
```

```bash
chmod 600 ssh/github_deploy_key
```

Used by all `rebuild-*` scripts in the deploy root. Do not commit the key file to Git.
