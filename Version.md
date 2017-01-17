# Version LOG - Chalkack.xyz

## v1.0.0
**2016.12.26**

개선된 점
- app.jxs에서 모든 코드 관리 ->  npm, webpack을 사용해 여러개의 js파일로 나눠 관리
- $.ajax success error -> done fail
- es6 적용

개선해야될 점
- jQuery - > Pure React App
- window object로 이동 - > react router 사용
- 불완전한 es6

## v1.0.1
**2016.12.30**

개선된 점
- css - > scss로 전환, js처럼 컴포넌트 별로 나누어놓음

개선해야될 점
- v1.0.0과 같음
- scss용 vendor prefix 스크립트가 npm에 보이지 않아서 mixin으로 처리했는데, 완벽하지 않음

## v1.0.2
**2017.1.16**

개선된 점
- scss의 mixin으로 제작한 vendor prefix를 bracket의 autoprefix 플러그인으로 대체함
- es6 완벽하게 적용(내 기준으로 ㅎㅎ) 및 코드 최적화 작업

개선해야될 점
- 항상 엔터 후 탭을 치다보니 코드 가독성이 나만보기 편하게 되버렸다...
- [Airbnb JavaScript 스타일 가이드](https://github.com/tipjs/javascript-style-guide)를 보며 jsLint를 사용해 수정필요
