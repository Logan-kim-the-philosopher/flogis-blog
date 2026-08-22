#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$repo_root"

rendered="$(mktemp)"
trap 'rm -f "$rendered"' EXIT

kubectl kustomize infra/k8s/overlays/prod > "$rendered"
kubectl apply --dry-run=client -f "$rendered" >/dev/null
xmllint --noout infra/jenkins/job-config.xml

rg -q 'name: flogis-blog-web' "$rendered"
rg -q 'name: flogis-blog-gateway' "$rendered"
rg -q 'harbor\.192\.168\.0\.110\.nip\.io/flogy_blog/site:replace-with-jenkins-build' "$rendered"
rg -q 'name: flogis-blog-tailscale-auth' infra/k8s/base/tailscale-auth.secret.example.yaml
rg -q 'absolute_redirect off;' infra/docker/nginx.conf
rg -q 'tailscale --socket=/tmp/tailscaled.sock funnel' infra/k8s/base/tailscale-gateway.yaml
rg -q '(Funnel on)' infra/k8s/base/tailscale-gateway.yaml

if rg -q 'tailscale-auth\.secret\.example\.yaml' infra/k8s/base/kustomization.yaml; then
  echo "Tailscale Secret example must not be included by Kustomize." >&2
  exit 1
fi

if rg -n 'tskey-auth-[A-Za-z0-9]|(^|[^A-Za-z0-9])sk[A-Za-z0-9_-]{40,}' \
  .dockerignore infra docs README.md package.json; then
  echo "Potential secret detected in deployment inputs." >&2
  exit 1
fi

echo "Deployment configuration validation passed."
