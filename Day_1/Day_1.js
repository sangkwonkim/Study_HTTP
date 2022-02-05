1장 인터넷 네트워크

1. 인터넷 통신
    물리적으로 거리가 있는 클라이언트와 서버가 어떻게 통신을 할까?
    클라이언트와 서버는 인터넷망을 이용해 서로 통신한다. 복잡한 인터넷 망에서 어떻게?

2. IP
    부여받은 IP 주소를 이용해 통신한다.

    IP(인터넷 프로토콜) 역할
        지정한 IP 주소에 데이터 전달
        패킷이라는 통신 단위로 데이터 전달

    IP 패킷 정보
        출발지 IP, 목적지 IP, 기타 정보가 IP 패킷에 담겨 전송 데이터와 함께 전송된다.

    클라이언트 & 서버 패킷 전달
        인터넷망 속 노드들이 IP 패킷에 담긴 정보를 이용해 IP 패킷을 전달한다.
        여기서 요청과 응답이 거치는 노드는 서로 다를 수 있다.

    IP 프로토콜의 한계
        비연결성 > 패킷을 받을 대상이 없거나 서비스 불능 상태여도 패킷 전송
        비신뢰성 > 패킷 소실될 수 있으며, 데이터 전달 순서가 변경될 수 있다.
        프로그램 구분 > 같은 IP를 이용하는 서버에서 통신하는 애플리케이션이 다수일 경우.

3. TCP
    IP 프로토콜의 한계를 해결할 수 있다.
    
    인터넷 프로토콜 스택의 4계층
        애플리케이션 계층 > HTTP, FTP
        전송계층 > TCP, UDP > TCP를 통해 IP를 보완
        인터넷 계층 > IP
        네트워크 인터페이스 계층 > LAN 카드 등등

    프로토콜 계층
        애플리케이션 > 웹 브라우저, 네트워크 게임, 채팅 프로그램
                      SOCKET 라이브러리
        OS > TCP, UDP        
             IP
        네트워크 인터페이스 > LAN 드라이버, LAN 장비

        1. 프로그램이 Hello world 라는 메시지를 작성
        2. SOCKET 라이브러리를 통해 OS 계층으로 전달
        3. TCP 정보 생성, 메시지 데이터 포함
        4. IP 패킷 생성, TCP 데이터 포함
        5. LAN 카드를 통해 Ethernet frame이 포함되어 인터넷으로 서버에 전달


    TCP/IP 패킷 정보
        TCP 세그먼트 > 출발지 PORT, 목적지 PORT, 전송제어, 순서, 검증정보 등이 담김

    TCP 특징(전송 제어 프로토콜)
        1. 연결 지향 TCP 3 way handshake (단, 물리적인 연결이 아닌 개념적인(논리적) 가상 연결)
        2. 데이터 전달 보증 > 서버에서 데이터를 받고 나면 응답을 보냄
        3. 순서 보장 > TCP 세그먼트에 순서 정보가 담겨 있음
            서버에서 순서와 다르게 정보를 받았다면, 해당 정보들의 재요청(서버에서 최적화가 가능하기는 함)
        
        > 신뢰할 수 있는 프로토콜로 현재 대부분 TCP 사용

    TCP 3 way handshake 
        연결과정
            클라이언트가 1. SYN 메시지(접속 요청)를 서버에 전달
            서버가 요청을 수락하며(ACK), 서버도 접속 요청을 전달 2. SYN + ACK
            클라이언트도 서버의 요청에 응답하는 3. ACK 을 보냄
            클라이언트와 서버가 연결됨을 확인하고 데이터 전송
            (최적화로 인해 클라이언트 ACK 전송 시 데이터도 전송)
            
        서버에서 SYN 응답이 없다면 연결이 되지 않아 메세지를 전달하지 않음

    UDP 특징(사용자 데이터그램 프로토콜)
        기능이 거의 없음
        TCP 3 way handshake 안함
        데이터 전달 보증 안함
        순서 보장 안함
        데이터 전달 및 순서가 보장되지 않지만 단순하고 빠름
        IP와 거의 같지만 PORT나 체크섬 정도만 추가
        > PORT는 하나의 IP에서 여러 애플리케이션을 이용할 때 패킷을 구분하는 용도
        애플리케이션에서 추가 작업 필요
        > TCP는 최적화 작업이 어렵다. UDP는 기능이 거의 없기 때문에 애플리케이션에서 최적화할 수 있다.
