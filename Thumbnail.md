# 이미지 리사이징 탐구 
 
##나만의 갤러리 "찰칵" 개발 초기
사진 중심의 사이트이기 때문에 고화질 이미지를 많이 올릴 경우 사이트가 느려지거나 렉이 걸려 사용자에게 나쁜 경험을 줄 수 있었다.
그래서 리사이징한 이미지들을 먼저 보여주고, 이미지를 클릭하면 원본 이미지를 보여주는 방식으로 진행하기로 결정했다.

축소된 이미지, 즉 썸네일을 만들려면 다음과 같은 방법이 있다.

* 원본 이미지가 생성되면 지정한 크기로 썸네일을 생성 후 저장
* 이미지를 요청하는 시점에 실시간으로 썸네일 생성

보통 썸네일을 미리 저장해 보여주는 방식을 택하는데, 다음과 같은 **단점**이 있다.

* 썸네일 갯수가 증가할수록 저장공간을 점점 많이 소비
* 지정한 크기가 변경될 경우 모든 썸네일 교체 필요

그래서 요즘에는 온디맨드 이미지 리사이징을 사용하는데, 다음과 같은 **장점**이 있다

* 원본 이미지 만큼의 저장공간을 소비
* 지정한 크기가 변경되어도 썸네일을 교체할 필요 없음

하지만 **단점** 도 있었다 (free tier 이용자인 나에게는...)

* 리사이징 요청이 한꺼번에 많이 들어올 경우 t2 micro 인스턴스로는 버틸 수 없음
* 위와 같은 이유로 리사이징 전용 서버를 필요 (내 돈은?)

>온디맨드 리사이징은 분명 매력적이었지만, 사용자가 많아진 후에 적용하는게 비용 대비 효율이 더 나을 것 같다.

**이와 같은 이유로 썸네일을 미리 생성하는 방식을  ~~어쩔수없이~~ 택했다.**

##  [thumbnailator](https://github.com/coobird/thumbnailator)

사실 이미지 리사이징을 직접 코드를 짜서 해결할 수도 있었지만 프론트엔드에 집중한 프로젝트인 만큼, 라이브러리를 사용하기로 했다.

>라이브러리를 사용하긴 했지만 아래 코드들은 직접 작성했다 (자부심!)

pom.xml에 dependency를 추가
``` xml
<dependency>
  <groupId>net.coobird</groupId>
  <artifactId>thumbnailator</artifactId>
  <version>0.4.8</version>
</dependency>
```

### 썸네일을 생성 후 저장

#### Controller 

``` java
@RequestMapping(value = "/photos", method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<?> multiUpload(MultipartHttpServletRequest multi,HttpServletResponse response) throws IOException {
		// 넘어온 파일을 리스트로 저장
		List<MultipartFile> mf = multi.getFiles("photo");		
		if {    
        		....                
		} else {
			for (int i = 0; i < mf.size(); i++) {
				// 파일 중복명 처리
				String genId = UUID.randomUUID().toString();
				// 본래 파일명
				String originalfileName = mf.get(i).getOriginalFilename();
				// 저장되는 파일 이름
				String saveFileName = "chalkack-" + genId + "." + originalfileName;
				// 리사이징되는 파일 이름
				String resizeFileName_medium = "medium-" + saveFileName;

				// 파일 저장
				S3Util.uploadImageToS3(mf.get(i),saveFileName);
                
				// 원본 이미지의 width,height
				BufferedImage image = ImageIO.read(mf.get(i).getInputStream());
				double getWidth = image.getWidth();
				double getHeight = image.getHeight();

				// 비율
				double resizeRatio = getWidth / getHeight;

				// 지정한 높이, 높이와 비율로 구한 너비
				int mediumHeight = 550;				
				int mediumWidth = (int) (resizeRatio * mediumHeight);

				//thumbnailator의 메소드를 이용해 썸네일을 bufferdimage로 만든다
				BufferedImage thumbnail_medium = Thumbnails.of(image).size(mediumWidth,mediumHeight).asBufferedImage();

				//BufferdImage와 filename을 파라미터에 넘겨 S3에 업로드
				S3Util_Thumbs.uploadImageToS3(thumbnail_medium, resizeFileName_medium);

				//업로드
				Map uploadMap = new HashMap();
                			....      
				uploadMap.put("p_height", (int)getHeight);
				
				int res = filedao.upload(uploadMap);

				if (res == 0) {
					return new ResponseEntity<String>("사진 업로드 중 문제가 발생했습니다", HttpStatus.CONFLICT);
				}
			} // end for
			return new ResponseEntity<String>(mf.size()+"개의 사진이 업로드되었습니다", HttpStatus.CREATED);
		}
	}
```

#### BufferdImage S3에 업로드하기
``` java
public class S3Util_Thumbs {
	private static final String ACCESS_KEY = "";
	private static final String SECRET_KEY = "";
	private static final String END_POINT_URL = "https://s3.ap-northeast-2.amazonaws.com";
	private static final String BUCKET = "";
	private static final String IMAGE_LOCATION = "";
	private static final String S3_CACHE = "3600"; // e.g 60
	private static AmazonS3 s3;

	public static void uploadImageToAWSS3(BufferedImage image,String Filename)
			throws IllegalStateException, IOException {
		try {
			AWSCredentials credentials = new BasicAWSCredentials(ACCESS_KEY, SECRET_KEY);
			java.security.Security.setProperty("networkaddress.cache.ttl", S3_CACHE);
			s3 = new AmazonS3Client(credentials);
			s3.setEndpoint(END_POINT_URL);
			
            // outputstream에 image객체를 저장 
			ByteArrayOutputStream os = new ByteArrayOutputStream();
			ImageIO.write(image, "png", os);
            
            //byte[]로 변환
  		  byte[] bytes = os.toByteArray();
            
            //metadata 설정 
			ObjectMetadata objectMetadata = new ObjectMetadata();
			objectMetadata.setContentLength(bytes.length);
			objectMetadata.setContentType("image/png");
            
			ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);            
            
			PutObjectRequest putObjectRequest = new PutObjectRequest(BUCKET, IMAGE_LOCATION + "/" + Filename, byteArrayInputStream, objectMetadata);
			putObjectRequest.setCannedAcl(CannedAccessControlList.PublicRead);
			s3.putObject(putObjectRequest);
			
		} catch (AmazonServiceException e) {
			e.printStackTrace();
		}						
	}
}
```





###온디맨드(실서버에 적용 X)
>추후 이미지를 크기,높이 선택해 다운로드할 수 있게 계획중

``` java
	@RequestMapping(value = "/{src}/{width}/{height}")
	@ResponseBody
	public ResponseEntity<?> Ondemand_Image(@PathVariable String src, @PathVariable int width,  @PathVariable int height ) throws IOException {

		/*
		 * 파라미터 : 이미지 src, 이미지 너비, 높이  
		 */

		// ImageIO로 url의 이미지를 읽어 bufferdimage에 집어넣는다
		URL url = new URL("s3domain/bucket/"+src);
		BufferedImage original = ImageIO.read(url);

		//thumbnailator의 메소드를 이용해 썸네일을 bufferdimage로 만든다
		BufferedImage thumbnail = Thumbnails.of(original).size(width,height).asBufferedImage();
		
		// outputstream에 image객체를 저장 
		ByteArrayOutputStream os = new ByteArrayOutputStream();		
		ImageIO.write(thumbnail, "png", os);		
		
		// inputstream으로 읽어들이기 
		InputStream is = new ByteArrayInputStream(os.toByteArray());
		
		//response header 설정 
		HttpHeaders headers = new HttpHeaders();
		//content-type
		headers.setContentType(MediaType.IMAGE_PNG);
		//캐시설정(1시간)
		headers.setCacheControl("max-age=3600");

		// inputstream - > byte[] 
		return new ResponseEntity<byte[]>(IOUtils.toByteArray(is), headers, HttpStatus.CREATED);
	}
```
