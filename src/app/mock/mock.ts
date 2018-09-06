import { GooglePlus } from '@ionic-native/google-plus/ngx';


export class GooglePlusMock extends GooglePlus {
    trySilentLogin(options) {
      return new Promise((resolve, reject) => {
        resolve({
          accessToken: "ya29.GlwMBqrdFRGwFGZrEFsfiQm88hv3EY8VIH4gnosRpykgcvcmmlFpmNnneUb-Vk1fmD8m4Prc5JP3cYwNVA2KCXiPp5pF-mFXh4mLb96Kr_BpfzDU0zaCdMx4v06smg",
          displayName: "Apps Manager",
          email: "app@transnoesis.com",
          familyName: "Manager",
          givenName: "Apps",
          idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjU1Yjg1NGVkZjM1ZjA5M2I0NzA4ZjcyZGVjNGYxNTE0OTgzNmU4YWMifQ.eyJhenAiOiIzMDI2OTA2Mjg4ODYtMTI2ajhmdDVwa3Q0aWhoYzhscDY1c29iMzJ0OTRwbDMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzMDI2OTA2Mjg4ODYtdDZpcjdjMWkzNDlrY2U5cXAydW1pcWhpMWQ5dmRjY2suYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTM4MTYzMTk0NjA3NjI2MzAzNDgiLCJoZCI6InRyYW5zbm9lc2lzLmNvbSIsImVtYWlsIjoiYXBwQHRyYW5zbm9lc2lzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJleHAiOjE1MzU4NTU2NTAsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6MTUzNTg1MjA1MCwibmFtZSI6IkFwcHMgTWFuYWdlciIsInBpY3R1cmUiOiJodHRwczovL2xoNS5nb29nbGV1c2VyY29udGVudC5jb20vLXExVTJKQkJ2Vlg0L0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FQVUlGYU8zaVlHeDFneC1qTWNsQmYxUHI0LVlRdDg4Z3cvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IkFwcHMiLCJmYW1pbHlfbmFtZSI6Ik1hbmFnZXIiLCJsb2NhbGUiOiJlbiJ9.eNOn0jt0nUonWabAddQ6ilocBX8_ON8Q1NBLFWfeqIw48zxnqHYRqXLQtazxzcrT1SW0zr6hWvnG_Jyei1AjZX9hzT-hosFOUASS544BtSWhDlnaGU_HMuzzfCtzKP_7Lt5c1O0HCW4leVLfH5sJ9Wc5f0tMEoh-C5GR1zD_voYgLQjXnjQvOfb2VH5kU1wYIDxdQS7",
          imageUrl: "https://lh5.googleusercontent.com/-q1U2JBBvVX4/AAAAAAAAAAI/AAAAAAAAAAA/APUIFaO3iYGx1gx-jMclBf1Pr4-YQt88gw/s96-c/photo.jpg",
          userId: "113816319460762630348",
        });
      });
    }
  }