# Flogi 팀원용 Pi 미팅 에이전트 · Sanity CLI 게시 세팅 가이드

> 작성 기준: 2026-09-06 · 대상: macOS 우선, Linux도 동일한 구조로 적용 가능
> 목적: 팀원에게 `flogis-blog` Git 저장소 접근 권한을 주지 않고도 회의 원본을 Pi로 정리하고, 사람의 검토와 승인을 거쳐 Flogi의 Sanity `production` 데이터셋에 게시할 수 있게 한다.

## 먼저 알아야 할 결론

저장소를 clone하지 않게 하는 것은 가능하지만, **미팅 에이전트 코드까지 전혀 전달하지 않고 실행하게 하는 것은 불가능**하다. 현재 에이전트는 저장소 안의 `.pi/extensions/meeting-workflow.ts`와 `scripts/meeting-agent/`에 구현되어 있기 때문이다.

따라서 오늘 세팅에서는 아래 방식을 권장한다.

1. 소유자가 저장소에서 **실행에 필요한 파일만 추린 최소 실행 번들 ZIP**을 만든다.
2. 팀원에게는 ZIP과 SHA-256 체크섬만 전달한다. `.git`, 사이트 소스, 실제 `.env`, 기존 회의 원본은 넣지 않는다.
3. Sanity에는 팀원·기기별 **별도 project robot token**을 만들고 만료일을 둔다. 토큰은 ZIP과 다른 채널로 전달한다.
4. 팀원은 자기 계정으로 Pi 모델 공급자에 로그인한다. 소유자의 Pi 인증 파일은 복사하지 않는다.
5. 평소에는 Pi TUI의 `/meeting` 또는 `meeting_prepare` → `meeting_publish` 도구를 사용한다. 실제 쓰기 직전에는 반드시 UI 확인창을 거친다.

이 방식은 저장소 접근을 막지만, 팀원 PC에 Sanity 쓰기 토큰을 놓는 순간 그 토큰이 허용하는 범위의 API 권한은 생긴다. **“저장소 권한 없음”과 “Sanity 콘텐츠 쓰기 제한”은 서로 다른 보안 경계**다.

## 구성도와 데이터 경계

```text
팀원 노트북
  ├─ 회의 TXT/Markdown/Clova 전사본
  ├─ 선택: 오디오 → 로컬 ffmpeg + whisper-cli 전사
  ├─ 최소 실행 번들
  │    ├─ Pi 프로젝트 확장
  │    └─ Node 게시 오케스트레이터
  └─ Pi TUI
       ├─ 원문 전체를 선택한 모델 공급자에게 보내 구조화
       ├─ 로컬 preview를 사람이 편집
       ├─ person 참조·중복·문서 형식 검증
       └─ 최종 UI 승인 후 Sanity API에 create
                              ↓
                    w1jypogd / production
                              ↓
          https://flogis-blog.tail2dac17.ts.net
```

- Pi는 구조화 호출에서 `--no-tools`로 실행되지만, **회의 원문은 모델 입력으로 전송된다**. `--no-tools`는 모델의 도구 사용을 막을 뿐, 공급자에게 보내는 프롬프트를 로컬에 가두는 옵션이 아니다.
- 회의 참석자의 동의와 조직의 개인정보·기밀정보 정책을 먼저 확인한다. 민감한 회의라면 승인된 공급자/계정인지 확인하거나, 게시 대상이 아닌 내용을 먼저 제거한다.
- 오디오 전사는 로컬 Whisper로 처리할 수 있지만, 만들어진 전사문은 이후 Pi 구조화 단계에서 모델 공급자에게 전달된다.
- 실행 결과와 원본 복사본은 팀원 PC의 `.meeting-agent/runs/`에 남는다. 이 폴더도 민감정보로 취급한다.
- Flogi 프론트엔드는 Sanity 데이터를 읽어 렌더링하므로, 새 문서를 만들 때마다 팀원이 저장소를 pull하거나 프론트엔드를 재배포할 필요는 없다.

## 현재 연결값

| 항목 | 값 |
|---|---|
| Sanity project ID | `w1jypogd` |
| Sanity dataset | `production` |
| Sanity API version | `2025-08-22` |
| 공개 블로그 | `https://flogis-blog.tail2dac17.ts.net` |
| Hosted Studio | `https://flogi-studio.sanity.studio/` |
| 기본 Pi 모델 | `openai-codex/gpt-5.4-mini` |
| 검증된 Pi 버전 | `@earendil-works/pi-coding-agent@0.84.2` |
| 지원 Node.js | `^22.20.0 || ^24.0.0 || >=26.0.0` (24 LTS 권장) |

기본 모델을 팀원 계정에서 사용할 수 없다면 Pi의 `/model`에서 실제 사용 가능한 모델을 고른 뒤 `.env`의 `MEETING_AGENT_PI_MODEL`을 그 모델 ID로 바꾼다.

---

# 1. 소유자가 미리 할 일

## 1-1. 권한 정책 결정

현재 에이전트가 생성할 수 있는 콘텐츠는 다음과 같다.

| 에이전트 분류 | 생성되는 Sanity 타입 |
|---|---|
| `project_meeting` | `meeting` |
| `conversation` | `meeting` |
| `team_operations` | `meeting` |
| `study_session` | `study` |

게시 전에는 다음 문서도 읽는다.

- `person`: 참석자/작성자 참조 확인
- `meeting`, `study`, `work`: 같은 문서 ID 또는 slug가 이미 있는지 확인

권장 권한은 다음과 같다.

- **Enterprise custom role을 쓸 수 있을 때:** `production`에서 `person`, `meeting`, `study`, `work` 읽기와 `meeting`, `study` 생성·게시만 허용한다. 프로젝트 상세와 데이터셋 읽기 권한도 필요하다.
- **기본 role만 쓸 때:** Project robot token에 `Editor` 또는 실제 create가 가능한 가장 낮은 역할을 부여한다. 이 경우 역할이 `production`의 다른 타입까지 쓸 수 있는지 반드시 확인한다.
- 팀원에게 오직 새 회의 게시만 허용하고 다른 문서 변경을 기술적으로 차단해야 하는데 현재 Sanity 플랜이 세밀한 역할을 지원하지 않는다면, 팀원 PC에 write token을 두는 구조를 사용하면 안 된다. 별도 제한 API/게시 게이트웨이를 두는 설계가 필요하다.

Sanity 공식 문서상 custom role과 content resource를 이용한 타입별 세부 제어는 Enterprise 기능이다. 기본 `Editor` 역할은 플랜에 따라 전체 데이터셋에 읽기·쓰기 권한을 줄 수 있다. 권한은 UI 문구만 보고 추정하지 말고 실제 역할 상세를 확인한다. 참고: [Sanity Roles](https://www.sanity.io/docs/user-guides/roles), [특정 문서 접근 제한](https://www.sanity.io/docs/developer-guides/restrict-access-to-specific-documents).

## 1-2. 팀원·기기 전용 Sanity 토큰 만들기

공유용 개인 토큰을 만들지 말고, 이 실행 번들 전용 **project robot token**을 만든다. Sanity도 애플리케이션이나 제3자 서비스에는 개인 토큰 대신 별도 robot token을 쓰고, 애플리케이션별로 분리할 것을 권장한다. 참고: [Sanity Authentication and tokens](https://www.sanity.io/docs/content-lake/http-auth), [Keeping your data safe](https://www.sanity.io/docs/content-lake/keeping-your-data-safe).

1. 소유자/관리자 계정으로 `https://www.sanity.io/manage/project/w1jypogd/api`에 접속한다.
2. `Settings` → `API` → `Tokens`에서 새 project token을 만든다.
3. 이름은 누가 어느 기기에서 쓰는지 알 수 있게 만든다.

   ```text
   meeting-publisher-<팀원이름>-<기기이름>-20260906
   ```

4. 앞 절에서 결정한 최소 역할을 부여한다.
5. 오늘 테스트용이면 짧은 만료일을, 상시 운영이면 30일 또는 조직 정책에 맞는 만료일을 설정한다.
6. 생성 직후 한 번만 보이는 토큰을 비밀번호 관리자나 일회성 비밀 링크에 저장한다.
7. ZIP, 이메일 본문, 메신저 일반 메시지, 이 문서, 쉘 히스토리에 토큰을 넣지 않는다.

Sanity의 project robot token은 팀원을 프로젝트 멤버로 초대하거나 저장소 권한을 줄 필요 없이 사용할 수 있다. 대신 토큰을 가진 사람은 토큰 역할 범위의 권한을 행사할 수 있으므로, 이름·만료·폐기 담당자를 기록해야 한다.

## 1-3. 사용할 `person` 문서 확인

모든 게시물에는 Sanity의 기존 `person` 문서가 최소 1개 연결되어야 한다. 새 팀원 세팅 전에 Hosted Studio에서 아래를 확인한다.

- 실제 참석자/작성자의 `person` 문서가 존재하는가
- 해당 문서 ID가 무엇인가: 예시 `person-yongjae-hong`
- 동명이인이 없는가

팀원에게는 **이름과 승인된 person ID 표**만 따로 전달한다. person 문서가 없다면 소유자가 Studio에서 먼저 만든다. 미팅 에이전트는 임의의 새 person 문서를 자동 생성하지 않는다.

## 1-4. 최소 실행 번들 만들기

### 반드시 포함할 파일

```text
flogi-meeting-publisher/
├── .pi/
│   ├── extensions/
│   │   └── meeting-workflow.ts
│   └── lib/
│       └── meeting-workflow.mjs
├── scripts/
│   └── meeting-agent/
│       ├── index.mjs
│       ├── lib.mjs
│       ├── setup-whisper.mjs
│       └── system-prompt.md
├── .env.example
├── .gitignore
├── package.json
└── package-lock.json
```

`meeting-workflow.ts`는 Pi가 프로젝트 루트를 찾을 때 `scripts/meeting-agent/index.mjs`의 존재를 확인한다. 폴더 구조를 바꾸거나 파일을 평평하게 합치면 확장이 로드되지 않는다.

### 저장소 루트에서 코드 복사

빈 배포 폴더를 만든 뒤 저장소 루트에서 다음처럼 필요한 코드만 복사한다. `/absolute/path/to/...`는 실제 작업 경로로 바꾼다.

```bash
mkdir -p "/absolute/path/to/flogi-meeting-publisher"

rsync -R \
  ./.pi/extensions/meeting-workflow.ts \
  ./.pi/lib/meeting-workflow.mjs \
  ./scripts/meeting-agent/index.mjs \
  ./scripts/meeting-agent/lib.mjs \
  ./scripts/meeting-agent/setup-whisper.mjs \
  ./scripts/meeting-agent/system-prompt.md \
  "/absolute/path/to/flogi-meeting-publisher/"
```

### 최소 `package.json`

배포 폴더의 `package.json`은 아래처럼 만든다. 버전을 고정해 소유자와 팀원이 같은 런타임을 사용하게 한다.

```json
{
  "name": "flogi-meeting-publisher",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": "^22.20.0 || ^24.0.0 || >=26.0.0"
  },
  "scripts": {
    "meeting:prepare": "node scripts/meeting-agent/index.mjs prepare",
    "meeting:resume": "node scripts/meeting-agent/index.mjs resume",
    "meeting:publish": "node scripts/meeting-agent/index.mjs publish",
    "meeting:doctor": "node scripts/meeting-agent/index.mjs doctor",
    "meeting:setup": "node scripts/meeting-agent/setup-whisper.mjs"
  },
  "dependencies": {
    "@sanity/client": "8.2.0",
    "zod": "4.4.3"
  }
}
```

### 안전한 `.env.example`

토큰 값은 반드시 빈칸으로 둔다.

```dotenv
SANITY_PROJECT_ID=w1jypogd
SANITY_DATASET=production
SANITY_API_VERSION=2025-08-22
SANITY_API_TOKEN=

MEETING_AGENT_PI_MODEL=openai-codex/gpt-5.4-mini
MEETING_AGENT_WHISPER_MODEL=.meeting-agent/models/ggml-large-v3-turbo.bin
MEETING_AGENT_OUTPUT_DIR=.meeting-agent/runs
MEETING_AGENT_PUBLIC_URL=https://flogis-blog.tail2dac17.ts.net
```

### `.gitignore`

팀원 폴더가 실수로 다른 Git 저장소나 클라우드 동기화 대상이 되더라도 비밀값과 회의 산출물이 따라가지 않게 한다.

```gitignore
.env
.meeting-agent/
node_modules/
*.log
.DS_Store
```

### lockfile 생성과 설치 검증

```bash
cd "/absolute/path/to/flogi-meeting-publisher"
npm install --package-lock-only --ignore-scripts
npm ci --ignore-scripts
npm run meeting:doctor
```

소유자 PC의 인증 상태 때문에 `meeting:doctor` 일부가 성공하는 것만으로 팀원 환경이 준비된 것은 아니다. 여기서는 파일 누락이나 Node 의존성 오류가 없는지만 확인한다.

### ZIP과 체크섬 만들기

1. `node_modules`는 ZIP에 넣지 않는다. 팀원 PC에서 lockfile로 다시 설치한다.
2. 실제 `.env`, `.meeting-agent`, `.git`, 회의 파일이 없는지 확인한다.
3. macOS에서는 다음처럼 압축하고 체크섬을 만든다.

```bash
cd "/absolute/path/to/bundle-parent"
ditto -c -k --keepParent flogi-meeting-publisher flogi-meeting-publisher-2026-09-06.zip
shasum -a 256 flogi-meeting-publisher-2026-09-06.zip > flogi-meeting-publisher-2026-09-06.zip.sha256
```

전달 전 마지막으로 압축 내용에 비밀값이 없는지 확인한다.

```bash
unzip -l flogi-meeting-publisher-2026-09-06.zip
```

ZIP과 `.sha256`은 함께 보내고, Sanity 토큰은 별도 보안 채널로 전달한다.

---

# 2. 팀원 노트북 세팅

## 2-1. 준비물

- macOS Terminal 또는 iTerm2
- Node.js `22.20+`, `24` 또는 `26+`의 짝수 메이저 버전. Node 24 LTS 권장
- npm
- Pi `0.84.2` 권장
- 본인의 ChatGPT Plus/Pro(Codex) 또는 승인된 다른 모델 공급자 계정
- 소유자가 준 최소 실행 번들 ZIP과 SHA-256 파일
- 별도 채널로 받은 Sanity project robot token
- 소유자가 확인해 준 `person` 문서 ID
- 오디오를 직접 전사할 때만 `ffmpeg`, `whisper-cli`, Whisper 모델

Node 설치는 [Node.js 공식 다운로드](https://nodejs.org/en/download)에서 Node 24 LTS를 선택하는 방식을 권장한다. macOS에서 Homebrew를 사용한다면 현재 최신 홀수 버전 대신 `node@24`를 지정한다.

```bash
brew install node@24
export PATH="$(brew --prefix node@24)/bin:$PATH"
node --version
npm --version
```

`node --version`이 `v24.x`인지 확인한다. 이 번들은 `22.20+`, `24`, `26+`를 지원하지만 일부 의존성이 홀수 메이저인 Node 23/25를 공식 지원하지 않으므로 LTS 짝수 버전을 쓴다. 너무 오래되거나 다른 Node가 PATH 앞쪽에 있으면 `which node`로 실제 실행 파일 위치를 확인한다.

## 2-2. ZIP 무결성 확인과 압축 해제

ZIP과 체크섬 파일을 같은 폴더에 둔다.

```bash
cd "/path/to/downloaded-files"
shasum -a 256 -c flogi-meeting-publisher-2026-09-06.zip.sha256
```

결과가 `OK`일 때만 압축을 푼다.

```bash
mkdir -p "$HOME/FlogiTools"
ditto -x -k flogi-meeting-publisher-2026-09-06.zip "$HOME/FlogiTools"
cd "$HOME/FlogiTools/flogi-meeting-publisher"
```

ZIP 안에 상위 폴더가 한 번 더 들어갔다면 실제 `package.json`이 있는 폴더로 이동한다.

## 2-3. Node 의존성 설치

```bash
npm ci --ignore-scripts
```

- `npm ci`는 소유자가 만든 `package-lock.json`에 고정된 버전을 설치한다.
- `--ignore-scripts`는 의존성의 lifecycle script를 실행하지 않게 한다.
- `sudo npm ci`는 사용하지 않는다.

## 2-4. Pi 설치

이 번들에서 검증한 버전을 고정해서 설치한다.

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent@0.84.2
pi --version
which pi
```

Pi 공식 설치 문서도 일반 npm 설치에 `--ignore-scripts`를 안내한다. 참고: [Pi 공식 저장소](https://github.com/earendil-works/pi), [Pi package 안내](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/packages.md).

글로벌 npm 설치 권한 오류가 나더라도 바로 `sudo`를 붙이지 않는다. Node를 Homebrew, `mise`, `nvm` 등 사용자 권한 환경에 다시 설치한 뒤 진행한다.

## 2-5. 팀원 본인 계정으로 Pi 로그인

번들 루트에서 Pi를 실행한다.

```bash
cd "$HOME/FlogiTools/flogi-meeting-publisher"
pi
```

Pi 안에서:

```text
/login
```

1. 기본 모델을 그대로 쓸 경우 `OpenAI Codex` 계열 공급자를 선택한다.
2. 브라우저 인증은 팀원 본인의 승인된 계정으로 완료한다.
3. `/model`을 열어 `openai-codex/gpt-5.4-mini`가 보이는지 확인한다.
4. 안 보이면 팀원 계정에서 사용 가능한 모델을 선택하고 정확한 모델 ID를 기록한다.
5. 소유자의 `~/.pi/agent/`나 인증 파일을 복사하지 않는다.

Pi의 project-local extension은 실행 사용자의 권한으로 코드와 명령을 실행할 수 있다. 처음 나타나는 프로젝트 신뢰 요청에서는 체크섬을 확인한 번들만 신뢰한다. 임의로 받은 `.pi` 폴더는 실행하지 않는다.

## 2-6. `.env` 만들기

Pi를 종료한 뒤 번들 루트에서:

```bash
cp .env.example .env
chmod 600 .env
```

텍스트 편집기로 `.env`를 열고 **`SANITY_API_TOKEN=` 뒤에만** 별도 전달받은 토큰을 넣는다.

```dotenv
SANITY_PROJECT_ID=w1jypogd
SANITY_DATASET=production
SANITY_API_VERSION=2025-08-22
SANITY_API_TOKEN=<별도 전달받은 project robot token>

MEETING_AGENT_PI_MODEL=openai-codex/gpt-5.4-mini
MEETING_AGENT_WHISPER_MODEL=.meeting-agent/models/ggml-large-v3-turbo.bin
MEETING_AGENT_OUTPUT_DIR=.meeting-agent/runs
MEETING_AGENT_PUBLIC_URL=https://flogis-blog.tail2dac17.ts.net
```

주의:

- `<`와 `>`까지 입력하는 것이 아니라 실제 토큰 문자열만 넣는다.
- 쉘의 `export` 명령으로 입력하면 히스토리에 남을 수 있으므로 이 가이드에서는 권장하지 않는다.
- `.env`를 메신저로 보내거나 화면 공유 중 열지 않는다.
- 다른 프로젝트의 `.env`와 합치지 않는다.
- 선택한 Pi 모델이 다르면 `MEETING_AGENT_PI_MODEL`만 실제 모델 ID로 바꾼다.

## 2-7. 상태 점검

```bash
npm run meeting:doctor
```

정상적인 핵심 상태는 다음과 같다.

```text
pi.installed: true
pi.auth.status: ready
sanity.configured: true
sanity.projectId: w1jypogd
sanity.dataset: production
sanity.writableToken: true
```

`sanity.writableToken: true`는 토큰 문자열이 존재한다는 뜻일 뿐, 실제 create 권한까지 증명하지는 않는다. 최초 게시 전에 반드시 `meeting_publish`의 validate-only 검증을 실행한다.

텍스트/전사본만 사용할 때 `transcription.ready: false`여도 된다. 오디오를 직접 전사할 때만 다음 절을 진행한다.

## 2-8. 선택: 오디오 로컬 전사 세팅

Clova TXT/JSON 전사본이 있으면 그 파일을 사용하는 편이 빠르고 Whisper 모델도 필요 없다. 전사본이 없는 오디오를 직접 처리할 때만 설치한다.

```bash
brew install ffmpeg whisper-cpp
ffmpeg -version
whisper-cli --help
```

다국어 모델을 한 번 내려받는다. 모델 파일은 크고 다운로드에 시간이 걸릴 수 있다.

```bash
npm run meeting:setup -- large-v3-turbo
npm run meeting:doctor
```

모델은 번들 안의 `.meeting-agent/models/`에 저장된다. 이 폴더를 동기화 서비스나 공유 폴더에 둘 필요는 없다.

---

# 3. 최초 무게시 테스트

## 3-1. 테스트 원본 준비

실제 기밀 회의를 첫 테스트로 쓰지 않는다. 날짜와 참석자가 명확한 짧은 더미 TXT를 사용한다. 빈 내용이나 20자 미만 본문은 검증에서 거절될 수 있다.

## 3-2. Pi 확장 로딩 확인

반드시 `package.json`과 `.pi`가 있는 번들 루트에서 실행한다.

```bash
cd "$HOME/FlogiTools/flogi-meeting-publisher"
pi
```

Pi 입력창에서 `/`를 입력했을 때 아래 명령이 보이는지 확인한다.

```text
/meeting
/meeting-status
/meeting-resume
```

명령이 보이지 않으면 현재 디렉터리와 프로젝트 신뢰 상태를 먼저 확인한다.

## 3-3. preview만 생성

Pi TUI에서 다음처럼 실행한다. 공백이나 한글이 있는 절대 경로는 큰따옴표로 감싼다.

```text
/meeting "/absolute/path/to/test-meeting.txt" --date 2026-09-06 --people person-실제-id --no-publish
```

동작 순서:

1. 원본을 `.meeting-agent/runs/.../source.*`로 복사한다.
2. Pi가 원문을 구조화한다.
3. 편집 가능한 `post.md` preview가 열린다.
4. 사람이 제목, 요약, 결정, 행동 항목, 화자, 날짜를 확인하고 저장하거나 취소한다.
5. `--no-publish`가 있으므로 Sanity 쓰기는 실행하지 않는다.

검토 화면을 저장해 닫은 뒤 `/meeting-status`로 run 경로를 확인한다.

## 3-4. 쓰기 없는 게시 검증

같은 Pi 세션에서 자연어로 아래처럼 요청한다.

```text
방금 만든 run을 meeting_publish 도구로 validateOnly=true 검증해줘. Sanity에는 절대 쓰지 마.
```

또는 run 경로를 명시한다.

```text
meeting_publish로 "/absolute/path/to/.meeting-agent/runs/pi-..."를 validateOnly=true로 검증해줘. people은 person-실제-id야.
```

정상 결과에는 `readyToPublish: true`, `duplicateCount: 0`이 포함된다. 이 검증은 다음을 확인한다.

- Sanity 토큰으로 필요한 읽기 요청이 가능한지
- `person` ID가 실제 존재하는지
- `meeting`/`study`/`work`에 같은 ID나 slug가 없는지
- 본문 필수 섹션과 데이터 형식이 맞는지

터미널에서 직접 확인할 수도 있다. `--confirm`에는 `structured.json`의 slug를 정확히 넣는다.

```bash
npm run meeting:publish -- ".meeting-agent/runs/<run-directory>" \
  --confirm <exact-slug> \
  --people person-실제-id \
  --validate-only
```

첫 테스트는 여기서 끝내고, 소유자가 결과를 확인한다. `--validate-only`를 제거하지 않는다.

---

# 4. 실제 운영 게시

## 4-1. 가장 안전한 기본 경로: `/meeting`

```bash
cd "$HOME/FlogiTools/flogi-meeting-publisher"
pi
```

Pi TUI에서:

```text
/meeting "/absolute/path/to/회의 원본.txt" --date 2026-09-06 --people person-id-1,person-id-2
```

이 경로는 아래 단계를 한 흐름에서 수행한다.

1. preview 생성
2. 편집기에서 사람 검토
3. person 참조와 중복 validate-only 검사
4. `Sanity에 실제 발행할까요?` UI 확인
5. 사람이 승인한 경우에만 Sanity `client.create()` 실행
6. 공개 URL 확인

preview 편집기에서 취소하거나 마지막 확인창에서 거절하면 Sanity에는 쓰지 않는다. preview는 `.meeting-agent/runs/`에 남는다.

## 4-2. 자연어로 에이전트에게 맡기는 경로

Pi에는 두 도구가 등록되어 있다.

- `meeting_prepare`: 원본을 구조화하고 preview만 만든다.
- `meeting_publish`: 기본값은 validate-only다. `validateOnly=false`여도 TUI/RPC UI의 사람 승인이 없으면 실제 게시가 거절된다.

예시 요청:

```text
"/absolute/path/to/회의.txt"를 2026-09-06 회의 글 preview로 정리해줘.
참석자는 person-id-1,person-id-2야. 먼저 meeting_prepare만 사용하고 게시하지 마.
```

preview를 검토한 뒤:

```text
방금 run을 meeting_publish로 validateOnly=true 검증해줘. 결과만 보여줘.
```

검증 결과와 preview가 맞을 때만:

```text
방금 검증한 run을 지금 게시해줘. meeting_publish의 validateOnly=false를 사용해.
최종 확인창을 보여주기 전에는 쓰지 마.
```

마지막 UI 확인창의 제목·타입·문서 ID·slug·사람 연결을 다시 보고 승인한다.

## 4-3. Clova 전사본 사용

오디오와 전사본이 모두 있으면 오디오는 원본 보존과 메타데이터 확인에 쓰고, 실제 내용은 Clova 전사본으로 정리한다.

```text
/meeting "/absolute/path/to/회의.m4a" --transcript "/absolute/path/to/클로바.json" --date 2026-09-06 --people person-id-1,person-id-2
```

전사본만 있으면 전사본 자체를 원본으로 쓴다.

```text
/meeting "/absolute/path/to/클로바.txt" --date 2026-09-06 --people person-id-1
```

## 4-4. 오디오 직접 전사

```text
/meeting "/absolute/path/to/회의.m4a" --date 2026-09-06 --people person-id-1,person-id-2
```

오디오는 로컬에서 16 kHz mono WAV로 변환한 뒤 한국어 Whisper 전사를 수행한다. 화자 분리가 보장되지 않으므로 사람이 preview에서 화자와 발언을 반드시 대조한다.

## 4-5. 날짜가 없어서 중단된 run 이어가기

에이전트는 파일 수정 시각을 회의 날짜로 사용하지 않는다. 명시 날짜, 오디오 메타데이터, 원문 근거 어디에서도 날짜를 확정하지 못하면 `needs_input` 상태로 멈춘다.

```text
/meeting-resume "/absolute/path/to/.meeting-agent/runs/<run-directory>" --date 2026-09-06 --people person-id-1
```

이 명령은 기존 `transcript.txt`, `structured.json`, `post.md`를 사용하므로 오디오 전사와 Pi 구조화를 다시 하지 않는다.

## 4-6. 터미널 직접 게시: 비상/관리자 경로

터미널 명령은 preview 생성과 검증에 유용하지만, 실제 `meeting:publish` 명령은 Pi의 두 번째 UI 승인창을 거치지 않는다. 토큰을 가진 사용자가 `--confirm`을 정확히 넣으면 직접 쓸 수 있다. 팀원 운영에서는 Pi TUI 경로를 기본으로 하고, 아래 실제 게시 명령은 관리자 절차로만 취급하는 편이 안전하다.

터미널의 prepare는 원래부터 preview 전용이다. 여기에 `--no-publish` 옵션을 붙이면 오류가 난다.

```bash
npm run meeting:prepare -- "/absolute/path/to/회의.txt" \
  --date 2026-09-06 \
  --people person-id-1
```

쓰기 없는 검증:

```bash
npm run meeting:publish -- ".meeting-agent/runs/<run-directory>" \
  --confirm <exact-slug> \
  --validate-only
```

실제 게시 — 조직에서 허용한 경우에만:

```bash
npm run meeting:publish -- ".meeting-agent/runs/<run-directory>" \
  --confirm <exact-slug>
```

`--confirm`은 preview의 slug 또는 document ID와 정확히 같아야 한다. 기존 ID/slug가 있으면 자동 덮어쓰지 않고 중단하며, 같은 run은 두 번 게시할 수 없다.

---

# 5. 사람이 반드시 검토할 내용

`post.md`에서 다음을 확인한 뒤 게시한다.

- 참석하지 않은 독자도 이해할 수 있는 배경과 요약인가
- 실제 회의 날짜인가
- 참석자/작성자가 올바른 Sanity `person`에 연결됐는가
- 사람별 발언과 근거가 원문과 일치하는가
- 제안, 잠정 합의, 확정, 보류, 미결정이 섞이지 않았는가
- 결정 이유가 원문에 실제 존재하는가
- 담당자, 기한, 숫자, 고유명사를 모델이 만들지 않았는가
- 전사 오류와 불명확한 화자가 검증 메모에 남았는가
- 외부 공개하면 안 되는 개인정보, 고객명, 비밀키, 내부 URL이 없는가
- slug가 영문 소문자·숫자·하이픈으로만 구성됐는가

콘텐츠 제한:

- 제목: 4~120자
- 본문: 최소 20자
- 참가자/작성자: 최소 1명
- `meeting` 참가자: 최대 8명
- 태그: 최대 8개, 태그당 최대 24자
- 미팅 에이전트는 임의 썸네일/`coverImage`를 게시하지 않는다.

Sanity API를 통한 mutation에는 Studio의 스키마 검증이 자동 적용되지 않는다. 이 번들의 자체 검증을 통과하더라도 사람이 내용을 확인해야 한다. 참고: [Sanity JS client mutations](https://www.sanity.io/docs/apis-and-sdks/js-client-mutations).

---

# 6. 실행 산출물과 보관 정책

기본 위치:

```text
.meeting-agent/runs/<timestamp>-<source>/
```

주요 파일:

| 파일 | 내용 |
|---|---|
| `source.*` | 변경하지 않고 복사한 원본 |
| `transcript.txt` | 원문 또는 정규화/Whisper 전사문 |
| `pi-request.md` | Pi 모델에 전달한 요청과 원문 |
| `pi-events.jsonl` | Pi 구조화 호출 이벤트 |
| `structured.json` | 안건·결정·행동 항목 구조화 결과 |
| `post.md` | 사람이 검토하는 실제 블로그 본문 |
| `sanity-document.json` | 게시 예정 Sanity 문서 |
| `publish-validation.json` | 쓰기 없는 게시 검증 결과 |
| `publish-result.json` | 실제 게시 성공 결과 |
| `run.json` | 상태, 경고, document ID, 게시 여부 |

이 폴더에는 원본과 전사문이 그대로 남으므로 다음 정책을 정한다.

- 보관 책임자와 보관 기간
- 게시 확인 후 원본/전사문을 소유자에게 이전할지 여부
- 팀원 PC와 백업/클라우드 동기화에서 언제 삭제할지
- 사고 시 어느 토큰을 폐기하고 어떤 run을 확인할지

삭제는 게시 URL과 `publish-result.json`을 확인하고, 조직의 보존 정책에 맞춰 수행한다. 단순히 앱을 종료한다고 run 파일이 지워지지는 않는다.

---

# 7. 문제 해결

## `pi: command not found`

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent@0.84.2
npm prefix -g
which pi
```

글로벌 npm bin 경로가 PATH에 없을 수 있다. 사용 중인 Node 버전 관리자의 셸 초기화가 적용됐는지 확인하고 터미널을 다시 연다.

## `pi.auth.status`가 `ready`가 아님

```bash
pi
```

Pi에서 `/login`을 다시 실행한다. `.env`의 모델 접두사와 로그인한 공급자가 일치해야 한다. 기본값 `openai-codex/gpt-5.4-mini`는 `openai-codex` 인증을 검사한다.

## `/meeting` 명령이 안 보임

- `package.json`과 `.pi`가 있는 번들 루트에서 `pi`를 실행했는지 확인한다.
- `.pi/extensions/meeting-workflow.ts`와 `.pi/lib/meeting-workflow.mjs`가 있는지 확인한다.
- `scripts/meeting-agent/index.mjs`가 원래 경로에 있는지 확인한다.
- 프로젝트 trust 요청을 거절했다면 체크섬과 파일 출처를 확인한 후 `/trust` 또는 재시작 흐름으로 다시 설정한다.
- Pi 안에서 `/reload`를 실행하거나 Pi를 재시작한다.

## `Unknown option '--no-publish'`

`--no-publish`는 Pi TUI의 `/meeting`과 `/meeting-resume` 전용 옵션이다. 터미널의 `npm run meeting:prepare`는 항상 preview 전용이므로 이 옵션을 받지 않는다.

## `Sanity person 문서를 찾지 못했습니다`

- ID 오타를 확인한다.
- 이름이 아니라 `person-...` 형식의 실제 문서 ID를 넣는다.
- Hosted Studio에서 person 문서가 published 상태인지 소유자가 확인한다.
- 필요한 person이 없으면 소유자가 먼저 만든다.

## `같은 ID 또는 slug 문서가 이미 있습니다`

안전장치가 정상 작동한 것이다. 기존 문서를 자동 덮어쓰지 않는다. Hosted Studio에서 기존 문서를 확인하고, 새 글이 맞다면 preview 단계부터 다른 slug로 다시 만든다.

## `401 Unauthorized` / `403 Forbidden`

- project ID와 dataset이 `w1jypogd / production`인지 확인한다.
- 토큰이 만료·폐기되지 않았는지 소유자가 확인한다.
- 토큰 역할에 `person`/중복 문서 읽기와 대상 타입 create 권한이 있는지 확인한다.
- 토큰 앞뒤에 공백이나 따옴표를 넣지 않았는지 확인한다.
- 토큰을 터미널에 출력하지 않는다. 필요하면 기존 토큰을 폐기하고 새로 발급한다.

## `ffmpeg` 또는 `whisper-cli`가 없음

텍스트/Clova 전사본을 쓰면 해당 도구가 필요 없다. 오디오 직접 전사가 필요하면:

```bash
brew install ffmpeg whisper-cpp
npm run meeting:setup -- large-v3-turbo
```

## 모델을 찾지 못함

Pi에서 `/model`로 팀원 계정이 사용할 수 있는 모델을 확인한다. 선택한 전체 모델 ID를 `.env`의 `MEETING_AGENT_PI_MODEL`에 넣고 `npm run meeting:doctor`를 다시 실행한다.

## 게시 성공 후 공개 페이지 확인 실패

`publish-result.json`이 있고 `run.json` 상태가 `published`라면 Sanity 쓰기는 이미 완료됐을 수 있다. 자동 재게시하지 않는다.

1. `https://flogis-blog.tail2dac17.ts.net/meetings/<slug>` 또는 `/study/<slug>`를 브라우저로 연다.
2. 팀원의 네트워크/Tailscale 접근 여부를 확인한다.
3. Hosted Studio에서 문서가 실제로 생성됐는지 확인한다.
4. 같은 run으로 다시 게시하지 말고 소유자에게 `documentId`와 오류만 전달한다. 토큰이나 원문은 보내지 않는다.

---

# 8. 당일 온보딩 체크리스트

## 소유자

- [ ] 팀원이 만들 수 있는 타입과 Sanity 권한 범위를 설명했다.
- [ ] 팀원·기기별 project robot token을 만들고 만료일을 설정했다.
- [ ] 토큰이 다른 콘텐츠까지 쓸 수 있는 범위를 팀원에게 고지했다.
- [ ] 승인된 `person` ID를 확인했다.
- [ ] 실제 `.env`, `.git`, 원본, 기존 run이 없는 최소 ZIP을 만들었다.
- [ ] package-lock과 SHA-256 파일을 만들었다.
- [ ] ZIP과 토큰을 서로 다른 채널로 전달했다.
- [ ] 회의 원문이 Pi 모델 공급자에게 전송된다는 점을 설명했다.
- [ ] 더미 원본으로 validate-only까지 함께 확인했다.

## 팀원

- [ ] ZIP의 SHA-256이 `OK`인지 확인했다.
- [ ] Node 24 LTS(또는 지원되는 `22.20+`/`26+`), Pi `0.84.2`를 확인했다.
- [ ] 본인 모델 계정으로 Pi에 로그인했다.
- [ ] `.env` 권한이 `600`이고 토큰을 외부에 공유하지 않았다.
- [ ] `npm run meeting:doctor`의 핵심 항목을 확인했다.
- [ ] `/meeting ... --no-publish`로 첫 preview를 만들었다.
- [ ] `meeting_publish validateOnly=true`가 통과했다.
- [ ] preview의 사람·결정·행동 항목·민감정보를 검토했다.
- [ ] 실제 게시 시 마지막 UI 확인창을 직접 승인했다.
- [ ] 게시 URL과 Sanity 문서를 소유자와 함께 확인했다.

## 세팅 종료/권한 회수

- [ ] 임시 토큰이면 당일 테스트 후 Sanity에서 폐기했다.
- [ ] 상시 토큰이면 만료일과 회수 담당자를 기록했다.
- [ ] 팀원이 역할을 바꾸거나 기기를 교체하면 기존 토큰을 폐기했다.
- [ ] 팀원 PC의 `.meeting-agent/runs/` 보관/삭제 정책을 적용했다.
- [ ] 소유자 Pi 인증이나 개인 Sanity token이 팀원 PC에 복사되지 않았음을 확인했다.

---

# 9. 버전 업데이트 원칙

팀원 번들은 Git 저장소가 아니므로 자동으로 최신 코드가 되지 않는다. 소유자가 새 ZIP을 만들어 교체한다.

1. 미팅 에이전트 코드가 바뀌면 번들 버전과 날짜를 올린다.
2. `@sanity/client`, `zod`, Pi 버전은 검증 후 명시적으로 갱신한다.
3. 새 `package-lock.json`과 ZIP SHA-256을 만든다.
4. 토큰은 새 ZIP에 넣지 않는다. 기존 `.env`를 무조건 덮어쓰지도 않는다.
5. 새 버전은 더미 파일로 preview → validate-only → 승인 취소까지 시험한 후 배포한다.
6. 팀원에게 구버전 폴더와 새 폴더를 동시에 실행하지 않게 한다.

## 참고 문서

- [Pi 공식 저장소와 설치 안내](https://github.com/earendil-works/pi)
- [Pi package/extension 보안과 설치 구조](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/packages.md)
- [Sanity 인증과 project robot token](https://www.sanity.io/docs/content-lake/http-auth)
- [Sanity 역할과 권한](https://www.sanity.io/docs/user-guides/roles)
- [Sanity API token 보안](https://www.sanity.io/docs/content-lake/keeping-your-data-safe)
- [Sanity JS client mutation](https://www.sanity.io/docs/apis-and-sdks/js-client-mutations)
- [Node.js 공식 다운로드](https://nodejs.org/en/download)
