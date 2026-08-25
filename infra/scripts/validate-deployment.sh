#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$repo_root"

rendered="$(mktemp)"
trap 'rm -f "$rendered"' EXIT

kubectl kustomize infra/k8s/overlays/prod > "$rendered"
kubectl apply --dry-run=client --validate=false -f "$rendered" >/dev/null
kubectl apply --dry-run=server -f "$rendered" >/dev/null
xmllint --noout infra/jenkins/job-config.xml

rg -q 'name: flogis-blog-web' "$rendered"
rg -q 'name: flogis-blog-gateway' "$rendered"
rg -q 'harbor\.192\.168\.0\.110\.nip\.io/flogy_blog/site:replace-with-jenkins-build' "$rendered"
rg -q 'name: flogis-blog-web-runtime-' "$rendered"
rg -q 'PUBLIC_SITE_URL: https://flogis-blog\.tail2dac17\.ts\.net' "$rendered"
rg -q 'SANITY_PROJECT_ID: w1jypogd' "$rendered"
rg -q 'SANITY_DATASET: production' "$rendered"
rg -q 'SANITY_STRICT_CONTENT: "true"' "$rendered"
rg -q 'readOnlyRootFilesystem: true' "$rendered"
rg -q 'memory: 128Mi' "$rendered"
rg -q 'name: flogis-blog-tailscale-auth' infra/k8s/base/tailscale-auth.secret.example.yaml
rg -q 'tailscale --socket=/tmp/tailscaled.sock funnel' infra/k8s/base/tailscale-gateway.yaml
rg -q '(Funnel on)' infra/k8s/base/tailscale-gateway.yaml
rg -q '^USER node$' infra/docker/Dockerfile
rg -q '^CMD \["node", "\./dist/server/entry\.mjs"\]$' infra/docker/Dockerfile
rg -q "session: false" astro.config.mjs
rg -q 'https://github\.com/Logan-kim-the-philosopher/flogis-blog\.git' infra/jenkins/Jenkinsfile
rg -q 'https://github\.com/Logan-kim-the-philosopher/flogis-blog\.git' infra/jenkins/job-config.xml
rg -q 'repoURL: https://github\.com/Logan-kim-the-philosopher/flogis-blog\.git' infra/k8s/argocd/application.yaml

if rg -n 'github\.com/develsvai/flogis-blog|--build-arg.*SANITY_|ARG SANITY_|(ARG|ENV).*SANITY_API_TOKEN|--env.*SANITY_API_TOKEN|name:[[:space:]]+SANITY_API_TOKEN' \
  infra/docker/Dockerfile infra/jenkins/Jenkinsfile infra/jenkins/job-config.xml infra/k8s/base infra/k8s/overlays infra/k8s/argocd; then
  echo "Fork URL, Sanity build argument, or API token reference found in deployment configuration." >&2
  exit 1
fi

placeholder_count="$(rg -o 'replace-with-jenkins-build' infra/k8s | wc -l | tr -d ' ')"
if [ "$placeholder_count" -ne 2 ]; then
  echo "Expected the documented source-branch image placeholder in exactly two files." >&2
  exit 1
fi

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
