# Execution Manifests

`node scripts/platform/execution-manifest.mjs` writes a deterministic, local record of one command invocation.

```sh
node scripts/platform/execution-manifest.mjs \
  --out .skill-sandbox/manifests/check.json \
  --artifact package.json \
  -- node --version
```

The manifest records the current Git commit, Node/package versions, platform, command, absolute working directory, duration, exit code, `PASS`/`FAIL`/`BLOCKED`/`NOT-RUN`, and SHA-256 references for regular-file artifacts. Command output is intentionally discarded so logs and secrets are not copied into the manifest. The utility performs no remote operation; the supplied command is caller-controlled and should be local-only.

Use `--status NOT-RUN --reason "..."` without `--` to record an intentionally unexecuted check. Exit codes are `0` for `PASS` or `NOT-RUN`, `1` for `FAIL` or `BLOCKED`, and `2` for usage or output errors.
