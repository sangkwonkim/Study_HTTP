// 검증 헤더와 조건부 요청
//     캐시 기본 동작
//         캐시가 없을 때
//             HTTP 헤더 0.1MB
//             HTTP 바디(star.jpg 파일) 1.0MB 라고 가정할 때,
//             첫 번째 요청에 1.1MB 네티워크를 차지

//             이후 요청에도 동일하게 1.1MB를 다시 내려줌

//             > 데이터가 변경되지 않아도 계속 네트워크를 통해서 데이터를 다운로드 받아야 한다
//             인터넷 네트워크는 매우 느리고 비싸다
//             브라우저 로딩 속도가 느리기 때문에 느린 사용자 경험을 제공한다

//         캐시 적용
//             첫 번째 응답에서 HTTP 헤더에 cache-control: max-age= 60가 작용된다면,
//             응답 결과를 캐시에 저장한다 > 이후 요청 시 캐시에서 먼저 조회한다
//             캐시 유효 시간 검증이 되면 사용 가능

//             > 캐시 덕분에 캐시 가능 시간동안 네트워크를 사용하지 않아도 된다
//             비싼 네트워크 사용량을 줄일 수 있다
//             브라우저 로딩 속도가 매우 빠르기 때문에 빠른 사용자 경험을 제공한다

//             캐시 유효 시간 초과
//             첫 번째 요청과 동일하게 요청 > 응답 결과를 다시 캐시에 저장

//             > 캐시 유효 시간이 초과하면 서버를 통해 데이터를 다시 조회하고 캐시를 갱신한다
//             이때 다시 네트워크 다운로드가 발생한다

//             서버에서 기존 데이터가 변경되지 않음
//             > 데이터를 전송하는 대신에 저장해 두었던 캐시를 재사용할 수 있다
//             단 클라이언트의 데이터와 서버의 데이터가 같다는 사실을 확인할 수 있는 방법 필요
            
//             검증 헤더 추가
//             Last-Modified > 데이터가 마지막에 수정된 시간
//             첫 번째 응답에서 응답 결과를 캐시에 저장하면서 데이터의 마지막 수정 시간도 같이 저장한다
            
//             캐시 시간이 초과하면 서버 요청을 보내야 할 때
//             if-modified-since HTTP 요청 헤더와 날짜를 먼저 보낸다
//             서버 상의 최종 수정 시간과 캐시에 저장된 최종 수정 시간이 동일하면 HTTP 바디없이 304 Not Modified로 응답
//             헤더는 0.1MB이기 때문에 바디가 없어서 네트워크 부하가 크게 줄어든다
//             클라이언트는 응답 헤더로 캐시 데이터를 갱신 > 캐시에서 데이터 사용

//     정리
//         캐시 유효 시간이 초과해도 서버의 데이터가 갱신되지 않으면 304 Not Modified + 헤더 메타 정보만 응답(바디는 없음)
//         > 클라이언트는 서버가 보낸 응답 헤더 정보로 캐시의 메타 정보를 갱신하고 캐시에 저장된 데이터를 재활용
//         > 결과적으로 네트워크 다운로드가 발생하지만 용량이 적은 헤더 정보만 다운로드 받기 때문에 실용적이다

// 검증 헤더와 조건부 요청2
//     검증 헤더
//         캐시 데이터와 서버 데이터가 같은지 검증하는 데이터
//         Last-Modified, ETag 사용

//     조건부 요청 헤더
//         검증 헤더로 조건에 따른 분기
//         If-Modified-Since > Last-Modified 사용
//         If-None-Match > ETag 사용
//         조건이 만족하면 200 OK
//         조건이 만족하지 않으면 304 Not Modified

//     예시
//         If-Modified-Since 이후에 데이터가 수정되지 않았다면
//         304 Not Modified로 헤더 데이터만 전송

//         데이터가 수정되었다면
//         200 OK 모든 데이터 전송(바디 포함)

//     If-Modified-Since, Last-Modified 단점
//         1초 미만 단위로 캐시 조정이 불가능
//         날짜 기반의 로직을 사용
//         수정날짜는 변경되었지만 데이터는 동일할 경우에도 파일을 새로 보내야 함
//         서버에서 별도의 캐시 로직을 관리하고 싶은 경우
//             스페이스나 주석처럼 큰 영향이 없는 변경에는 캐시를 유지하고 싶은 경우!

//     If-None-Match, ETag
//         ETag(Entity Tag)
//         캐시용 데이터에 임의의 고유한 버전 이름을 달아주고 데이터가 변경되면 이 이름을 바꿔서 변경
//         > 해시 라이브러리를 통해 파일을 Hash 알고리즘에 넣어서 결과를 받을 수 있는데, 이때 파일이 동일하면 Hash 값도 동일
//         > ETag만 보내서 같으면 유지, 다르면 다시 받음

//     첫 번째 응답에서 ETag와 캐시 정보를 저장
//     두 번째 요청에서 캐시 유효 시간이 지나면 If-None-Match에 ETag값을 담아서 요청한다
//     변경 되지 않으면 304 응답을 하고 캐시 데이터는 갱신하고 캐시는 재사용

//     정리
//         ETag만 서버에 보내서 같으면 유지, 다르면 다시 받기
//         캐시 제어 로직을 서버에서 완전히 관리
//         > 클라이언트는 단순히 이 값을 서버에 제공함으로 클라이언트는 캐시 메커니즘을 모름

// 정리
// 캐시 제어 헤더
//     Cache-Control 캐시 지시어(directives)
//         Cache-Control: max-age 캐시 유효 시간, 초단위
//         Cache-Control: no-cache 데이터는 캐시해도 되지만 항상 origin 서버에 검증하고 사용
//         Cache-Control: no-store 데이터에 민감한 정보가 있으므로 저장하면 안됨
//             > 메모리에서 사용하고 최대한 빨리 삭제

//     Pragma 캐시 제어(하위 호환)
//         Pragema : no-cache
//         HTTP 1.0 하위 호환

//     Expires 캐시 만료일 지정(하위 호환)
//         캐시 만료일을 정확한 날짜로 지정
//         HTTP 1.0부터 사용
//         지금은 더 유연한 Cache-Control: max-age 사용 권장
//         Cache-Control: max-age와 함께 사용하면 Expires는 무시

// 검증 헤더와 조건부 요청 해더
//     검증 헤더(Validator)
//         ETag, Last-Modified 사용
//     조건부 요청 헤더
//         If-Match, If-None-Match > ETag 값 사용
//         If-Modified-Since, If-Unmodified-Since > Last-Modified 값 사용

// 프록시 캐시
//     Origin 서버 직접 접근
//         물리적인 거리가 멀 경우 응답 시간이 걸릴 수 밖에 없다
//         물리적으로 가까운 프록시 캐시 서버를 도입
//         > 원 서버를 직접 접근하는 것이 아니라 프록시 캐시 서버에 접근해서 응답 시간이 축소됨
//         프록시 캐시 서버에 public 캐시가 존재

//     Cache-Control: public
//     > 응답이 퍼블릭 캐시에 저장되어도 됨 
//     Cache-Control: private
//     > 응답이 해당 사용자만을 위한 것으로, private 캐시에 저장해야 함(기본값)
//     > 사용자 웹 브라우저
//     Cache-Control: s-maxage
//     > 프록시 캐시에만 적용되는 max-age
//     Age: 60(HTTP 헤더)
//     > 오리진 서버에서 응답 후 프록시 캐시 내에 머문 시간(초)

// 캐시 무효화
//     Cache-Control 캐시 지시어 - 확실한 캐시 무효화 응답
//         캐시를 적용 안해도 웹 브라우저가 GET 요청의 경우 임의적으로 캐시함 완전히 캐시를 하지 않기 위해서는 다음과 같이 무효화해야함
//     Cache-Control: no-cache, no-store, must-revalidate
//     Pragma : no-cache > HTTP 1.0 하위 호환
    
//     Cache-Control: no-cache
//         데이터는 캐시해도 되지만, 항상 원 서버에 검증하고 사용
//         > no-cache + ETag가 캐시에 저장되어 있을 경우, 원 서버에 요청하고
//         304 Not Modified 응답 받으면 캐시 데이터를 사용
//         만약에, no-cache인데 원 서버에 접근할 수 없는 경우 서버 설정에 따라 캐시 데이터를 반환할 수 있다(오류보다는 오래된 데이터라도 보내주자)

//     Cache-Control: no-store
//         데이터에 민감한 정보가 있으므로 저장하면 안됨
//         > 메모리에서 사용하고 최대한 빨리 삭제

//     Cache-Control: must-revalidate
//         캐시 만료 후 최초 조회 시 원 서버에 검증해야함
//         원 서버 접근 실패 시 반드시 오류가 발생해야함 - 504 Gateway Timeout
//         must-revalidate는 캐시 유효 시간이라면 캐시를 사용함
//         > 원 서버에 검증을 받으려고 하는 데 원 서버에 접근이 불가할 경우
//         항상 504 Gateway Timeout 응답
//         > 돈과 관련된 정보의 경우 no-cache 처럼 오래된 정보를 받으면 안됨
//         이런 문제가 발생할 수 있기 때문에 캐시 무효화를 위해 세가지 지시어를 모두 넣어야 한다