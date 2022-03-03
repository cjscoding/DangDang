##22.01.24
## Docker 설정, Kurento 서버 설정

### Ubuntu (AWS)

I6C203T.pem 파일 있는 경로에서 `ssh -i I6C203T.pem ubuntu@i6c203.p.ssafy.io`

`sudo apt install net-tools` 후  `ifconfig`

```
ubuntu@ip-172-26-8-126:~$ ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 9001
        inet 172.26.8.126  netmask 255.255.240.0  broadcast 172.26.15.255
        inet6 fe80::4:72ff:fedb:5912  prefixlen 64  scopeid 0x20<link>
        ether 02:04:72:db:59:12  txqueuelen 1000  (Ethernet)
        RX packets 2243  bytes 503732 (503.7 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 2133  bytes 282184 (282.1 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

```shell
sudo apt-get update

sudo apt-get install \
 apt-transport-https \
 ca-certificates \
 curl \
 gnupg \
 lsb-release
 
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o
/usr/share/keyrings/docker-archive-keyring.gpg

echo \
 "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg]
https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list >
/dev/null

sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io

sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/dockercompose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

```


### Kurento (미디어 서버)

 ```shell
docker pull kurento/kurento-media-server:latest

docker run -d --name kms --network host \ kurento/kurento-media-server:latest
 ```



### STUN/TURN 서버 설치

[인바운드 포트 허용 ](https://archijude.tistory.com/392)

3478 (UDP/TCP), 49152-65535(UDP)


[EC2 프라이빗/퍼블릭 IP 주소 찾기](https://www.cyberciti.biz/faq/how-to-find-public-ip-address-aws-ec2-or-lightsail-vm/)

퍼블릭 ip 주소:13.209.18.212

프라이빗 ip 주소:172.26.8.126

```shell
sudo apt-get update && sudo apt-get install --no-install-recommends --yes \ coturn
```

`TURNSERVER_ENABLED=1`

```shell
listening-port=3478
tls-listening-port=5349
listening-ip=<EC2 의 프라이빗 IPv4 주소>
external-ip=<EC2 의 퍼블릭 IPv4 주소>/<EC2 의 프라이빗 IPv4 주소>
relay-ip=<EC2 의 프라이빗 IPv4 주소>
fingerprint
lt-cred-mech
user=myuser:mypassword
realm=myrealm
log-file=/var/log/turn.log
simple-log
```

` sudo service coturn restart`


#### Kurento WebRtcEndpoint.ini 수정 

[쿠렌토(Kurento)미디어 서버 설치](https://ilovephp.tistory.com/entry/쿠렌토Kurento미디어-서버-설치-javascript-클라이언트-연동-1)

```shell
turnURL=<user>:<password>@<serverIp>:<serverPort>?transport=udp
```

**포트 번호 꼭 적어줘야 함 (명세서랑 다름!!)**

-----

[kurento-webRTC 예제](https://github.com/Kurento/kurento-tutorial-java)

`mvn -U clean spring-boot:run`

https://13.209.18.212:8443/  
