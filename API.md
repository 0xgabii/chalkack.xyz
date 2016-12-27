# API Document - Chalkack.xyz

1. [알아두기](#1-알아두기)
2. [Http Status Code](#2-http-status-code)
3. [메인 페이지](#3-메인-페이지)
4. [앨범 목록](#4-앨범-목록)
5. [앨범 이동](#5-앨범-이동)
6. [앨범 생성](#6-앨범-생성)
7. [앨범 수정](#7-앨범-수정)
8. [앨범 삭제](#8-앨범-삭제)
9. [사진 목록](#9-사진-목록)
10. [사진 추가](#10-사진-추가)
11. [사진 수정](#11-사진-수정-다른-앨범으로-이동)
12. [사진 삭제](#12-사진-삭제-휴지통으로-이동)
13. [삭제된 파일 목록](#13-삭제된-파일-목록)
14. [삭제된 파일 복원](#14-삭제된-파일-복원)
15. [삭제된 파일 영구삭제](#15-삭제된-파일-영구삭제)


## 1. 알아두기
"찰칵"의 API는 RESTful하게 디자인 되었습니다.
랜딩 페이지를 제외한 모든 API는 로그인 후 이용가능합니다.

>**v1.0.0** - secure cookie 대신 session을 사용해 사용자 인증 처리 (개선될 예정) 

이 문서는 [여기](http://bluehouselab-sms-openapi.readthedocs.io/index.html)를 참고해 작성했습니다.

## 2. HTTP Status Code

스프링의 ResponseEntity를 사용해 응답합니다.

``` java
ex) return new ResponseEntity<List>(jsonlist, HttpStatus.OK);
```

| Status Code  | Description |
| ------------ | ----------- |
| 200 | OK, 성공 |
| 201 | Created, 리소스 생성됨 |
| 400 | Bad Request,  부정확한 입력값 |
| 401 | Unauthorized, 인증되지 않음 |
| 404 | Not Found, 리소스가 존재하지 않음 |
| 409 | Conflict, 리소스가 이동되었거나 삭제됨 |

## 3. 메인 페이지 

### 3.1 요청
#### Header
| Header  | Value |
| ------- | ---- |
| Method | GET |
| URI Path | /home |
| Content-Type | application/x-www-form-urlencoded; charset=utf-8 | 

#### Data Format
| Key | Value | Format | 필수 | 설명 | 비고 | 
| :-: | :---: | :----: | :--: | --- | :--: |
| gridType | 3 | Int | NO | 갤러리의 grid를 설정 | 기본값 3 | 

### 3.2 응답
#### Header
| Header  | Value |
| ------- | ---- |
| Status | 200, OK |
| Content-Type | application/json; charset=utf-8 | 

#### Data Format
| Key | Value | Format | 설명 |
| :-: | --- | :----: | --- |
| list | [{"src":"image-src","idx":153}] | List | 사진 리스트(앨범도 포함), grid값만큼 생성됨|
| src | "aws-s3-bucket/medium-image-src" | String | 원본에서 리사이징된 사진의 url |
| idx | 123 | Int | 사진, 앨범 idx |
| album | {"idx":628,"title":"React","info":0, ...} | Map | 리스트의 앨범 데이터, **/home**에서만 존재 |
| album | {"a_cover":"image-src","title":"HOME",} | Map | 현재 위치의 정보  |

#### Data Example
[여기]('JSON.md')의 **/home**에서 볼 수 있습니다


## 4. 앨범 목록

### 4.1 요청
#### Header
| Header  | Value |
| ------- | ---- |
| Method | GET |
| URI Path | /albums |
| Content-Type | application/x-www-form-urlencoded; charset=utf-8 | 

#### Data Format
파라미터 없음

### 4.2 응답
#### Header
| Header  | Value |
| ------- | ---- |
| Status | 200, OK |
| Content-Type | application/json; charset=utf-8 | 

#### Data Format
| Key | Value | Format | 설명 |
| :-: | --- | :----: | --- |
| album | {"idx":628,"title":"React","info":0, ...} | Map | 앨범 데이터 |
| src | "aws-s3-bucket/small-image-src" | String | 원본에서 리사이징된 사진의 url |
| idx | 123 | Int | 앨범 idx |
| title | "React" | String | 앨범 제목 |
| date | "2016년 12월 20일" | String | 앨범이 생성된 시간|
| info | 2 | Int | 앨범에 존재하는 사진의 갯수 |

#### Data Example
[여기]('JSON.md')의 **/albums**에서 볼 수 있습니다

## 5. 앨범 이동 

### 5.1 요청
#### Header
| Header  | Value |
| ------- | ---- |
| Method | GET |
| URI Path | /albums/{idx} |
| Content-Type | application/x-www-form-urlencoded; charset=utf-8 | 

#### Data Format
| Key | Value | Format | 필수 | 설명 | 비고 | 
| :-: | :---: | :----: | :--: | --- | :--: |
| gridType | 3 | Int | NO | 갤러리의 grid를 설정 | 기본값 3 | 

### 5.2 응답
#### Header
| Header  | Value |
| ------- | ---- |
| Status | 200, OK |
| Content-Type | application/json; charset=utf-8 | 

#### Data Format
| Key | Value | Format | 설명 |
| :-: | --- | :----: | --- |
| list | [{"src":"image-src","idx":153}] | List | 사진 리스트(앨범도 포함), grid값만큼 생성됨|
| src | "aws-s3-bucket/medium-image-src" | String | 원본에서 리사이징된 사진의 url |
| idx | 123 | Int | 사진 idx |
| album | {"a_cover":"image-src","title":"HOME",} | Map | 현재 위치의 정보  |

#### Data Example
[여기]('JSON.md')의 **/albums/{idx}**에서 볼 수 있습니다

## 6. 앨범 생성 

### 6.1 요청
#### Header
| Header  | Value |
| ------- | ---- |
| Method | POST |
| URI Path | /albums |
| Content-Type | application/x-www-form-urlencoded; charset=utf-8 | 

#### Data Format
| Key | Value | Format | 필수 | 설명 | 비고 | 
| :-: | :---: | :----: | :--: | --- | :--: |
| a_name | "새 앨범" | String | YES | 앨범 제목  | - | 

### 6.2 응답
#### Header
| Header  | Value |
| ------- | ---- |
| Status | 201, Created |
| Content-Type | application/x-www-form-urlencoded; charset=utf-8 | 

#### Data Format
| Key | Value | Format | 설명 |
| :-: | --- | :----: | :---: |
| - | "앨범 '새 앨범' 이 생성되었습니다" | String | - |

## 7. 앨범 수정

### 7.1 요청
#### Header
| Header  | Value |
| ------- | ---- |
| Method | PUT |
| URI Path | /albums/{idx} |
| Content-Type | application/x-www-form-urlencoded; charset=utf-8 | 

#### Data Format
| Key | Value | Format | 필수 | 설명 | 비고 | 
| :-: | :---: | :----: | :--: | --- | :--: |
| a_name | "앨범 수정" | String | YES | 앨범 제목  | - | 

### 7.2 응답
#### Header
| Header  | Value |
| ------- | ---- |
| Status | 200, OK |
| Content-Type | application/x-www-form-urlencoded; charset=utf-8 | 

#### Data Format
| Key | Value | Format | 설명 |
| :-: | --- | :----: | :---: |
| - | "앨범 이름이 '앨범 수정' 로 수정되었습니다" | String | - |


## 8. ~~앨범 삭제~~ 
>**v1.0.0** 앨범 삭제 후 복구 방법을 마련하지 못함


## 9. 사진 목록
### 9.1 요청
#### Header
| Header  | Value |
| ------- | ---- |
| Method | GET |
| URI Path | /photos |
| Content-Type | application/x-www-form-urlencoded; charset=utf-8 | 

#### Data Format
파라미터 없음

### 9.2 응답
#### Header
| Header  | Value |
| ------- | ---- |
| Status | 200, OK |
| Content-Type | application/json; charset=utf-8 | 

#### Data Format
| Key | Value | Format | 설명 |
| :-: | --- | :----: | --- |
| idx | 123 | Int | 사진 idx |
| src | "aws-s3-bucket/medium-image-src" | String | 원본에서 리사이징된 사진의 url |

#### Data Example
[여기]('JSON.md')의 **/photos**에서 볼 수 있습니다

## 10. 사진 추가
### 10.1 요청
#### Header
| Header  | Value |
| ------- | ---- |
| Method | POST |
| URI Path | /photos |
| Content-Type | multipart/form-data;| 

#### Data Format
| Key | Value | Format | 필수 | 설명 | 비고 | 
| :-: | :---: | :----: | :--: | :---: | :--: |
| photo | binary-data | File | YES | - | - | 

### 10.2 응답
#### Header
| Header  | Value |
| ------- | ---- |
| Status | 200, OK |
| Content-Type | application/x-www-form-urlencoded; charset=utf-8 | 

#### Data Format
| Key | Value | Format | 설명 |
| :-: | --- | :----: | :---: |
| - | "1개의 사진이 업로드되었습니다" | String | - |

## 11. 사진 수정 (다른 앨범으로 이동)
### 11.1 요청
#### Header
| Header  | Value |
| ------- | ---- |
| Method | PUT |
| URI Path | /photos/{idx} |
| Content-Type | application/x-www-form-urlencoded; charset=utf-8 | 

#### Data Format
| Key | Value | Format | 필수 | 설명 | 비고 | 
| :-: | :---: | :----: | :--: | :---: | :--: |
| idx | "1,2,3" | String | YES | - | 여러개의 사진을 이동할 경우 ',' 로 구분해 전송합니다 | 

### 11.2 응답
#### Header
| Header  | Value |
| ------- | ---- |
| Status | 200, OK |
| Content-Type | application/x-www-form-urlencoded; charset=utf-8 | 

#### Data Format
| Key | Value | Format | 설명 |
| :-: | --- | :----: | :---: |
| - | "1개의 사진이 이동되었습니다" | String | - |

## 12. 사진 삭제 (휴지통으로 이동)
### 12.1 요청
#### Header
| Header  | Value |
| ------- | ---- |
| Method | DELETE |
| URI Path | /photos/{idx} |
| Content-Type | application/x-www-form-urlencoded; charset=utf-8 | 

#### Data Format
| Key | Value | Format | 필수 | 설명 | 비고 | 
| :-: | :---: | :----: | :--: | :---: | :--: |
| idx | "1,2,3" | String | YES | - | 여러개의 사진을 삭제할 경우 ',' 로 구분해 전송합니다 | 

### 12.2 응답
#### Header
| Header  | Value |
| ------- | ---- |
| Status | 200, OK |
| Content-Type | application/x-www-form-urlencoded; charset=utf-8 | 

#### Data Format
| Key | Value | Format | 설명 |
| :-: | --- | :----: | :---: |
| - | "1개의 사진이 삭제되었습니다" | String | - |

## 13. 삭제된 파일 목록
### 13.1 요청
#### Header
| Header  | Value |
| ------- | ---- |
| Method | GET |
| URI Path | /deleted-photos |
| Content-Type | application/x-www-form-urlencoded; charset=utf-8 | 

#### Data Format
파라미터 없음

### 13.2 응답
#### Header
| Header  | Value |
| ------- | ---- |
| Status | 200, OK |
| Content-Type | application/json; charset=utf-8 | 

#### Data Format
| Key | Value | Format | 설명 |
| :-: | --- | :----: | --- |
| idx | 123 | Int | 사진 idx |
| src | "aws-s3-bucket/small-image-src" | String | 원본에서 리사이징된 사진의 url |

#### Data Example
[여기]('JSON.md')의 **/photos**와 같습니다.

## 14. 삭제된 파일 복원
### 14.1 요청
#### Header
| Header  | Value |
| ------- | ---- |
| Method | PUT |
| URI Path | /deleted-photos/{idx} |
| Content-Type | application/x-www-form-urlencoded; charset=utf-8 | 

#### Data Format
| Key | Value | Format | 필수 | 설명 | 비고 | 
| :-: | :---: | :----: | :--: | :---: | :--: |
| idx | "1,2,3" | String | YES | - | 여러개의 사진을 복원할 경우 ',' 로 구분해 전송합니다 | 

### 14.2 응답
#### Header
| Header  | Value |
| ------- | ---- |
| Status | 200, OK |
| Content-Type | application/x-www-form-urlencoded; charset=utf-8 | 

#### Data Format
| Key | Value | Format | 설명 |
| :-: | --- | :----: | :---: |
| - | "1개의 사진을 복원했습니다" | String | - |

## 15. 삭제된 파일 영구삭제
### 15.1 요청
#### Header
| Header  | Value |
| ------- | ---- |
| Method | DELETE |
| URI Path | /deleted-photos/{idx} |
| Content-Type | application/x-www-form-urlencoded; charset=utf-8 | 

#### Data Format
| Key | Value | Format | 필수 | 설명 | 비고 | 
| :-: | :---: | :----: | :--: | :---: | :--: |
| idx | "1,2,3" | String | YES | - | 여러개의 사진을 영구삭제할 경우 ',' 로 구분해 전송합니다 | 

### 15.2 응답
#### Header
| Header  | Value |
| ------- | ---- |
| Status | 200, OK |
| Content-Type | application/json; charset=utf-8 | 

#### Data Format
| Key | Value | Format | 설명 |
| :-: | --- | :----: | :---: |
| - | "1개의 사진을 영구히 삭제했습니다" | String | - |
