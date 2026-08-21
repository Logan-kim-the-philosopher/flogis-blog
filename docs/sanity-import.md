# Sanity seed import

샘플 운영 데이터는 아래 파일에 준비되어 있습니다.

- `sanity/import/flogi-seed.ndjson`

포함 내용:
- `siteSettings` 1개
- `person` 4개
- `study` 5개
- `work` 5개
- `meeting` 5개

## Import

### 방법 A. CLI 직접 import

Sanity CLI 로그인이 된 상태에서:

```bash
cd /Users/hskim/Projects/aifrontier-media
npx sanity datasets import sanity/import/flogi-seed.ndjson production --replace
```

또는 project id / dataset을 명시하려면:

```bash
cd /Users/hskim/Projects/aifrontier-media
npx sanity datasets import sanity/import/flogi-seed.ndjson \
  --project-id w1jypogd \
  --dataset production \
  --replace
```

### 방법 B. Pi 사용 시

Pi에서 Sanity MCP를 함께 쓰더라도, seed import는 위의 **Sanity CLI 직접 import**를 기준 워크플로로 사용하세요.

## Notes

- 이미지 필드는 `_sanityAsset: "image@https://..."` 형식으로 외부 이미지를 가져오도록 작성했습니다.
- 동일 `_id` 문서가 있으면 `--replace` 기준으로 덮어씁니다.
- singleton 문서인 `siteSettings`는 `_id: "siteSettings"`로 고정되어 있습니다.
