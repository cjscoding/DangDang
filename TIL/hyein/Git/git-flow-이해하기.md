# Git flow 이해하기

## Git flow?

- Vincent Driessen이라는 사람의 블로그 글에 의해 퍼지기 시작했고, 현재는 `git으로 개발할 때 거의 표준처럼 사용되는 방법론`
- git flow는 기능이 아닌, 하나의 방법론임
- git flow보다 더 좋은 방법이 나오면 언제든지 변할 수 있다.

## 브랜치 설명

![git-flow-그림](https://user-images.githubusercontent.com/25563077/149147318-5395474b-a0c0-4fc2-9c71-55297b363a2b.png)

- 총 5가지의 브랜치를 사용해서 운영한다.
  - `master`: 기준이 되는 브랜치. 제품을 배포한다.
  - `develop`: `master`에서 파생된 개발 브랜치. 개발자들은 이 브랜치를 기준으로 각자 작업한 기능(feature)들을 merge한다.
  - `feature`: `develop`에서 파생된 브랜치로, 단위 기능을 개발한다. 기능 개발이 완료되면 `develop` 브랜치에 merge한다.
  - `release`: 배포를 위해 `master`에 보내기 전, QA 검사를 하는 브랜치
  - `hotfix`: `master`에서 배포한 뒤 버그가 생겼을 때 급하게 생성하는 브랜치
- `master`와 `develop`이 메인이고, 나머지는 필요에 의해서 생기는 브랜치임

- 브랜치 접두어는 팀마다 컨벤션을 가지고 다르게 지을 수 있지만, `feature/{기능이름}`이 일반적이다.

## 어떻게 작업하는 거야?

1. `master` 브랜치에서 시작!
2. `master`에서 `develop` 브랜치를 만들자!
3. 회원가입 기능이 필요하면 `develop`에서 `feature/회원가입` 브랜치를 만들어서 작업하자!
4. 회원가입 기능이 끝나면 `feature-회원가입` 브랜치를 `develop`에 합친다.
5. 모든 기능이 완료되면 `release` 브랜치를 만들고, QA 검사를 한다.
6. 진짜진짜최종 `release`를 `master`에 합치고, 태그로 버전을 추가해서 배포한다.
7. 배포를 했는데 미처 발견하지 못한 버그가 있을 경우, `hotfix` 브랜치를 만들어 긴급 수정 후 태그 생성, 재배포한다.

## 진행 방법

![진행-방법](https://user-images.githubusercontent.com/25563077/149150066-6dbc1a49-c473-4311-980a-63d7008c30f8.png)

1. 팀 구성원들은 원격 저장소를 각자 fork 뜬다.
2. 각자 fork한 원격 저장소를 clone 받아 작업
3. 작업이 끝나면 바로 merge하지 않고, 메인 원격 저장소로 Pull request한다.
   - `hyein-feature`를 `main-develop`에 Pull Request
   - 이때 코드 리뷰를 하고 merge하면 참 좋겠죠?

## CLI 설정, 사용 방법을 알려줘!

### 초기화

```bash
$ git flow init
```

```bash
SSAFY@DESKTOP-KVCQHCD MINGW64 ~/Desktop/SSAFY/test (master)
$ git flow init
No branches exist yet. Base branches must be created now.
Branch name for production releases: [master]
Branch name for "next release" development: [develop]

How to name your supporting branch prefixes?
Feature branches? [feature/]
Bugfix branches? [bugfix/]
Release branches? [release/]
Hotfix branches? [hotfix/]
Support branches? [support/]
Version tag prefix? []
Hooks and filters directory? [C:/Users/SSAFY/Desktop/SSAFY/test/.git/hooks]
```

- 각 브랜치에서 엔터를 치면 `[]` 안에 들어간 이름으로 브랜치가 생성되고, 커스텀할 수 있다.
- 귀찮아! 하는 사람들을 위한 디폴트 옵션도 존재한다.

```bash
$ git flow init -d
```

- 각각 `master`, `develop`, `feature`, `release`, `hotfix`, `support` 라는 이름의 브랜치가 만들어진다.

## feature 브랜치 사용하기

### 브랜치 생성

```bash
$ git flow feature start <feature-name>
```

- `feature/`를 접두어로 설정했으므로 `feature/feature-name` 브랜치가 자동 생성되고, checkout 된다.

### 개발 끝 (브랜치 머지)

```bash
$ git flow feature finish <feature-name>
```

- `develop` 브랜치로 체크아웃 뒤 `feature/feature-name` 브랜치를 머지 후 삭제한다.
- Pull Request가 필요할 경우는 이 명령어 대신 Pull Request를 연다.

### 원격 저장소 push

```bash
$ git flow feature publish <feature-name>
```

- Pull Request를 이용하려면 원격 저장소에 먼저 push해야 한다. 그때 쓰는 명령어

### 원격 저장소 pull

```bash
$ git flow feature pull origin <feature-name>
```

## release 브랜치 사용하기

### 브랜치 생성

```bash
$ git flow release start <version>
```

- `release/version` 이라는 이름의 릴리즈 브랜치를 생성

### 원격 저장소 push

```bash
$ git flow release publish <version>
```

### 원격 저장소 pull

```bash
$ git flow release track <version>
```

- `pull`이 아니라 `track`이다!

### 릴리즈 (브랜치 병합 & 삭제)

```bash
$ git flow release finish <version>
```

1. `release` 브랜치를 `master`에 병합하고
2. `release` 버전을 태그로 생성한다. 이때, `git flow init`에서 명시한 `Version tag prefix` 문자열이 버전 앞에 붙는다.
3. `release` 브랜치를 `develop` 브랜치에 병합한다.
4. `release` 브랜치를 삭제한다.

### 새 버전이 포함된 master 브랜치에 태그 붙이기

```bash
$ git push --tags
```

## hotfix 브랜치 사용법

### 브랜치 생성

```bash
$ git hotfix start <version>
```

- `hotfix` 브랜치 생성 후 체크아웃

### 브랜치 병합 & 삭제

```bash
$ git hotfix finish <version>
```

1. `hotfix` 브랜치를 `master` 브랜치에 병합
2. `hotfix` 버전을 태그로 생성. 마찬가지로 `Version tag prefix`가 버전 앞에 붙음
3. `hotfix` 브랜치를 `develop` 브랜치에 병합
4. `hotfix` 브랜치를 삭제

### hotfix가 포함된 master 브랜치에 태그 붙이기

```bash
$ git push \--tags
```

## References

- [Git flow 개념 이해하기](https://uxgjs.tistory.com/183)
- [git-flow cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/index.ko_KR.html)
- [[협업] 협업을 위한 Git Flow 설정하기](https://overcome-the-limits.tistory.com/entry/%ED%98%91%EC%97%85-%ED%98%91%EC%97%85%EC%9D%84-%EC%9C%84%ED%95%9C-Git-Flow-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0)
- [git 브랜치 전략에 대해서](https://tecoble.techcourse.co.kr/post/2021-07-15-git-branch/)
- [[Git] git-flow 소개, 설치 및 사용법](https://hbase.tistory.com/60)
