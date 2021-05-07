1. expo는 리엑트의 create-react-app 과 똑같다 보며니됨.. 리엑트 네이티브를 간편하게 설치할수있게해줌
   또한 expo가 리엑트native를 안드로이드 ios에서 사용할수있게 해줌 2. ReactNativeCLI 사용하면 맥에서 ios, 원도우에서 안드로이드 개발만 가능.. 또한 설정도 쉽게 할수있음..
   EXPO GO는 테스트를 할수있다

   단점 : 한계가 있다.. expo로 블루투스 같은걸 할수없어 android, IOS 새로 다 깔아서 해야함
   그리고 배포할떄 SDK를 다 포함해서 무거워진다! 수많은 API가 포함된다!

2. 그래서 우리는 expo와 xcode, androidstudio 의 장점들만 이용해볼것임! managed workflow이용해서
   양쪽 장점들만 eject(꺼내오기) 해서 사용하면됨!
   그래서 nativeCLI로 시작해서 expo의 좋은 기능을 꺼내올것임!!
   managed workflow는 리액트 네이티브를 위핸 create React app 이고 bear workflow는 완전히 컨트롤 가능
   하지만 이때문에 조금 복잡해질수있음
   managed workflow ? bear workflow? 가능한 범위가있는데 우리는 둘다 가능한 범위내에서 할것임!
   우리는 managed workflow로 시작해서 bear workflow로 끝낼것임(둘다 사용가능한 범위)
   expo에서 어떤 네이티브 코드도 돌리지 않도록 해야함!!(블루투스 같은거 엑스포는 안됨)
