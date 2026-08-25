# 결정

1. runtime base도 고정 digest의 Node 22.20 slim을 사용하고 build stage의 `node_modules`와 `dist`를 복사한다. 현재 package가 runtime dependency를 모두 dependencies에 두므로 안정적인 동작을 우선했다.
2. Sanity·canonical 설정은 Docker ARG가 아니라 Jenkins smoke/Kubernetes ConfigMap의 runtime env로만 주입한다.
3. production dataset은 공개 읽기이므로 `SANITY_API_TOKEN` Secret을 만들지 않는다. private dataset 전환은 별도 Secret 설계로 다룬다.
4. 사용하지 않는 Astro session 지원을 `session: false`로 꺼 read-only root에서 filesystem session driver가 필요 없게 했다.
5. web Pod의 `/tmp` emptyDir만 유지하고 Nginx cache/run volume과 정적 Nginx config는 제거했다.
6. source/deploy canonical repository를 `https://github.com/Logan-kim-the-philosopher/flogis-blog.git`로 고정했다.
7. Jenkins smoke는 이미지 안의 Node `fetch`를 사용해 별도 curl/wget package를 runtime image에 추가하지 않는다.
8. Tailscale gateway 동작은 유지하고 pod-level `RuntimeDefault` seccomp만 추가했다.
