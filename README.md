# tpl-gulpfile


## Description
gulpfileのテンプレートです。  
今まで、pugとphpを分けて管理し、その後各テンプレートに入れこむやり方をしていましたが、  
pugとphpのgulpfileを一緒にして管理することにしました。


## node
v14.14.0


## gulp
v4.0.2

<br>

## Command

### init
```
npm i
```

### dafault
```
gulp
```

### watch
```
gulp watch
```

<br>

## タスク

全てのタスクは、開発ディレクトリから本番ディレクトリに対して行います。  

### pugTask
`**/*.pug`から`**/*.php`へにコンパイルします。

### sassTask
`**/*.scss`から`**/*.min.css`へコンパイルします。  
ベンダープレフィックスを自動で付与します。  
※圧縮しないバージョンもコメントアウトで入っています。

### imgTask
jpg,png,gif,svgファイルを圧縮します。  
jpg,png,gifに関しては、webpにも圧縮・変換します。  
  
ただし、以下のファイルはコンパイルしません。
+ metaディレクトリのファイル
+ 「_」「#」「apng」から始まっているファイル

### spriteTask
スプライト用のsvgファイル「sprite.svg」を生成します。  
spriteディレクトリのファイルが自動で結合します。  
開発ディレクトリを使わない会社用に、本番ディレクトリにもpartsディレクトリで圧縮した個別のsvgファイルを追加します。

### jsTask
`**/*.js`から`**/*.min.js`にコンパイルします。  

以下のディレクトリでは、「ディレクトリ名.js」等で出力します。
+ library（圧縮しません）
+ module（圧縮します）

※圧縮しないバージョンもコメントアウトで入っています。

### devMove
上記以外のファイルを開発ディレクトリから本番ディレクトリへ移動します。
+ mp4
+ mp3
+ mov
+ m4a
+ txt
+ pdf
+ ttf
+ eot
+ woff
+ woff2
+ ico
+ webp
+ apng*.+(png)
+ *.css

### watchTTask

### default


※詳細を確認したい場合は、gulpfile.jsの中身を見てください。
