# Git

### git 기초

> 중요해 보이는 거
>
> ```git
> git config
> git status
> git log
> git remote
> ```
>
> 파일 삭제
>
> ```git
> rm filename
> git rm filename
> ```
>
> 파일 이름 변경
>
> ```git
> git mv filename1 filename2
> ```
>
> 이전 커밋에 추가하기
>
> ```git
> git commit -m "prev commit"
> git add forgotten_file
> git commit --amend
> ```
>
> 파일 상태 Unstage로 바꾸기
>
> ```git
> git reset HEAD filename
> ```
>
> 최근 커밋된 버전으로 파일 되돌리기(조심히 쓰자,,)
>
> ```git
> git checkout -- filename
> ```
>
> Git Alias
>
> ```git
> git config --global alias.XX XXXX
> ex) git config --global alias.ci commit
> ex) git config --global alias.unstage "reset HEAD --"
> ```

### git branch

>브랜치 목록
>
>```git
>git branch
>// git ls-remote origin (remote 브랜치)
>```
>
>브랜치 생성
>
>```git
>git branch bname
>```
>
>브랜치 이동
>
>```git
>git checkout bname
>// git checkout -b bname (브랜치 만들면서 이동)
>```
>
>브랜치 삭제
>
>```git
>git branch -d bname
>```
>
>Merge
>
>```git
>git checkout master?
>git merge bname
>// 충돌나면, 해결하고, git commit
>```
>
>로컬에 서버 정보 동기화
>
>```git
>git fetch origin
>// 동기화 이후, origin/master 포인트를 최신 커밋으로 이동시킨다.
>```
>
>서버에 있는 브랜치에 접속
>
>```git
>git checkout origin/bname
>```
>
>서버에 있는 브랜치에서 시작하는 새 브랜치 만들기
>
>```git
>git checkout -b bname origin/server_branch
>```
>
>push
>
>```git
>git push origin bname
>```
>
>* Rebase
>
>merge와 비슷하지만, history를 남기지 않는다.
>
>merge가 꼬일 가능성이 있으므로, 안 쓰는 것이 좋아보인다.



* origin은 remote 이름이다. remote 이름은 따로 설정해줄 수 있으나, 기본적으로 origin이라는 이름을 갖는다.

