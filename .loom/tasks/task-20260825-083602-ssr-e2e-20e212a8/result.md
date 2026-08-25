# 결과

원본 저장소를 source of truth로 전환한 뒤 Astro Node SSR 이미지를 운영 배포했고, Sanity production 콘텐츠가 재빌드 없이 발행·수정·삭제되는 전체 경로를 검증했다.

## 배포 계보

- 원본 저장소: `https://github.com/Logan-kim-the-philosopher/flogis-blog.git`
- source branch/SHA: `Haru2_dev` / `2cd077d5937496656298230997f250de6ec8fb7a`
- Jenkins: `Flogis-Blog #11` `SUCCESS`
- Harbor tag: `harbor.192.168.0.110.nip.io/flogy_blog/site:11-2cd077d5`
- Harbor digest: `sha256:f7adacf46c50b139737621567271b911fab2a674d69f01808b4b82ed0e32d83b`
- deploy branch/SHA: `deploy` / `51d40c767c6a5a1629ec8652bd96e7a08759261e`
- Argo CD: repoURL 원본 저장소, revision `51d40c767c6a5a1629ec8652bd96e7a08759261e`, `Synced` / `Healthy` / operation `Succeeded`
- Kubernetes: web `2/2`, gateway `1/1`, 모든 web container restart `0`

## 무재빌드 Sanity E2E

운영 글과 충돌하지 않는 전용 문서 `study-codex-ssr-e2e-20260825` / slug `codex-ssr-e2e-20260825`만 사용했다. 기존 study의 cover image와 author 참조를 읽어서 재사용했으며 다른 문서는 변경하지 않았다.

1. 사전 조회에서 전용 ID·draft ID·slug는 `0`건이었다.
2. 제목 `SSR 무재빌드 E2E 검증 A`와 marker `SSR_E2E_BODY_A_MARKER`로 published 문서를 생성했다.
3. 첫 공개 요청에서 상세·홈·study 목록·검색 JSON·RSS·sitemap이 모두 `200`과 `Cache-Control: no-store`를 반환했다. 상세 canonical, `og:title`, `og:url`도 운영 URL과 일치했다.
4. 동일 문서를 제목 `SSR 무재빌드 E2E 검증 B`와 marker `SSR_E2E_BODY_B_MARKER`로 수정했다. 첫 공개 요청에서 새 값이 보이고 이전 제목은 상세·홈·목록·검색·RSS에서 사라졌다.
5. 생성과 수정 전후 Jenkins 마지막 빌드는 계속 `#11`, Argo revision은 계속 `51d40c...`, web image digest와 두 Pod UID는 동일했다. Pod restart도 모두 `0`이었다.
6. 전용 published 문서를 삭제했다. Sanity 잔존 조회는 `0`건, 상세는 `404`, 홈·목록·검색·RSS·sitemap에는 전용 slug와 제목이 남지 않았다.

고정된 web Pod 증거:

- `flogis-blog-web-5fc9d446f-bpg6b`, UID `ed6bc5ca-e66f-4e31-8000-308b9b6dc1a8`
- `flogis-blog-web-5fc9d446f-dxbs6`, UID `0d269d5a-0100-46e2-9975-48dd4f1bcd61`
- 두 Pod 모두 image digest `sha256:f7adacf46c50b139737621567271b911fab2a674d69f01808b4b82ed0e32d83b`

## 공개 및 로컬 검증

- `https://flogis-blog.tail2dac17.ts.net/`은 직접 HTTPS로 정상 응답했다.
- 외부 fetch proxy에서도 동일 HTTPS URL의 Flogi 홈과 production Sanity 콘텐츠를 읽었다.
- `npm run build` 통과: Astro `output: server`, `@astrojs/node` server build 완료.
- `bash infra/scripts/validate-deployment.sh` 통과: Kustomize와 Kubernetes server dry-run 포함. 기존 Tailscale sidecar의 cluster PodSecurity 경고만 있었고 검증 결과는 성공이다.
- `git diff --check` 통과.

전용 E2E 문서는 최종적으로 삭제되어 production dataset에 남아 있지 않다.
