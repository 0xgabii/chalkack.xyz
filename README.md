# 나만의 갤러리 "찰칵"

![메인페이지](https://s3.ap-northeast-2.amazonaws.com/chalkack/index/wallpaper.png)

### 연관된 글들
* [ChangeLog](ChangeLog.md)
* [REST API 문서](API.md)
* [이미지 리사이징 이야기](Thumbnail.md)
* [Toast 컴포넌트](Toast.md)

## 1. 소개
횡스크롤형 UI로 사진을 아름답게 관리할 수 있는 웹애플리케이션

## 2. 개발 

### 2.1 계기

부모님이 여행하시며 찍었던 사진들을 보고 **사진**만 관리할 수 있는 **드롭박스** 컨셉으로 프로젝트를 구상하게 되었음

### 2.2 기간
**2016년 11월 12일 ~ 12월 20일**

| 기간 | 내용 |
| ------------ | ----------- |
| 1주차 | 레이아웃 구상, DB 테이블 작성	|
| 2주차 | 핀터레스트 레이아웃을 변형해 UI 방향 잡음, 프로토타입 제작 |
| 3주차 | 설계해놓은 JSON 데이터를 가지고 jQuery로(React는 생각조차 안했음) 코딩 |
| 4주차 | 데이터 하나가 입력될 때 마다 바뀌는 부분이 너무 많아지면서 jQuery의 한계를 느낌 (UI 90% 완성) |
| 5주차 | jQuery - > React 작은 컴포넌트부터 바꿔나감 |
| 6주차 | 스프링의 ResponseEntity를 이용해 상황에 맞는 HttpCode와 데이터 반환, 썸네일 생성 테스트  |
| 7주차 | AWS서비스로 서버 구축, godaddy로 도메인 GET!, 랜딩 페이지 제작 |

### 2.3 특징

1. **jQuery플러그인이나 CSS프레임워크를 사용하지 않고 프론트엔드 개발**
2. 상단의 switch 버튼으로 사용자가 원하는대로 그리드를 바꿀 수 있음
3. React + Ajax 로 화면전환 없이 모든 동작 처리
4. REST API 적용

### 2.4 사용 프레임워크, 라이브러리

* 프론트엔드
	* [React](https://github.com/facebook/react)
	* [jQuery](https://github.com/jquery/jquery) - 제거 예정
	* [npm](https://github.com/npm/npm)
		* webpack
		* babel

* 백엔드 
	* [Spring](https://github.com/spring-projects/spring-framework)
	* [Jackson](https://github.com/FasterXML/jackson) - JSON 
	* [thumbnailator](https://github.com/coobird/thumbnailator) - 이미지 리사이징 처리
	* BCrypt 
	
* 아마존 웹 서비스 (AWS) 
    * EC2
    * RDS (MariaDB)
    * S3 

## 3. 소감

보통 프로젝트가 끝나고 나면 종종 **번아웃**되었는데  
[Okky에 올린 글](http://okky.kr/article/366709) 에서 많은 분들이 피드백을 주셔서 더욱 불타오르게 된 프로젝트였다.

###React!!!

jQuery로만 코딩하다 보니 업데이트하는 DOM이 많아질수록 코드가 복잡해져 대안을 찾다가 diffing 알고리즘을 통해 뷰 레이어에서 필요한 부분만을 업데이트 할 수 있는 React를 적용하게 되었다. 처음에는 state니 prop이니 이해가 잘 되지 않았는데, 3일정도 골머리를 싸매니 단방향 데이터 흐름이 이해되고 **신세계**를 느끼게 되었다.  

사진 한 장을 추가하는 동작을 수행한다면  

jQuery : 추가 버튼 클릭 -> 데이터를 받아 DOM을 ~~하나하나~~ 만들어 append -> 그 외의 다른 DOM들도 업데이트  
React : 추가 버튼 클릭 -> prop으로 부모로 전달 -> 부모 컴포넌트에서 전체 사진 요청 -> 데이터를 받아 state 갱신 -> DOM 업데이트  

물론 React는 추가 버튼을 클릭하기만 하면 그 뒤는 **자동**으로 수행된다.  
다른 것엔 신경쓰지 않고 **컴포넌트 하나**에만 **집중**할 수 있다는게 엄청난 장점인듯 하다!  

## 4. 도움
* [jQuery to React](http://blog.sapzil.org/2014/08/10/jquery-to-react/)
* [React 강좌 - Velopert](https://velopert.com/reactjs-tutorials)
