# expense-tracker
一個簡單的網路記帳工具。


## Installing
1. 打開終端機


2. 下載 expense-tracker-sequelize 資料夾 ( 下載位置會依你打開終端機的位置而定 )

```
$ git clone https://github.com/ariel92911/expense-tracker-sequelize.git
```

3. 請在 https://developers.facebook.com/ 申請第三方登入用的金鑰

4. 在本檔案的跟目錄新增 .env 的檔案，並輸入以下程式碼
```
FACEBOOK_ID = <輸入FB ID>
FACEBOOK_SECRET = <輸入FB SECRET>
FACEBOOK_CALLBACK=http://www.example.com/auth/facebook/callback 
```

5. 進入 expense-tracker-sequelize 資料夾
```
$ cd expense-tracker-sequelize
```

6. 安裝npm套件
```
$ npm install
```

7. 至 .\expense-tracker\models\seeds 資料夾，執行以下指令，以新增種子資料
```
$ node seeder.js
```

8. 回到根目錄，執行專案
```
$ npm run dev
```

9. 在瀏覽器輸入以下網址以使用 expense-tracker
```
http://localhost:3000
```



## Feature
1) 可在首頁一次瀏覽所有支出的清單
2) 可在首頁看到所有支出清單的總金額
3) 可新增一筆支出
4) 可編輯支出的所有屬性 (一次只能編輯一筆)
5) 可刪除任何一筆支出 (一次只能刪除一筆)
6) 可在首頁可以根據支出「類別」、「月份」篩選支出；總金額的計算只會包括被篩選出來的支出總和
7) 可透過 email 跟密碼註冊與登入，並只能看到自己建立的支出（使用者必需登入才可以使用這個 app 或看到資料）
8) 可透過 Facebook 帳號登入
