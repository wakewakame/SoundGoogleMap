![demo](demo/demo.gif)  
[https://youtu.be/0ZR4q2ALdIM](https://youtu.be/0ZR4q2ALdIM)  

**これは未完成のプログラムです**

# SoundGoogleMap
マイクの音に合わせてGoogleMapの建物が踊ります。

# 仕組み
GoogleMapはjsファイルを`XMLHttpReqest`で取得し、そのテキストをjsとして実行しています。
そのため、`XMLHttpRequest`でテキストデータを取得する関数をフックすることによりGoogleMapのプログラムを書き換えることが可能になります。
今回はWebGLのシェーダを書き換えてみることにした。

また、Google Mapのjavascriptは(多分)毎日変更され、その都度変数名が変わります。
そのため、今回はソースコードを置き換えるのではなく、一部の文字列を正規表現で置換する手法を取りました。

# 用意するもの
- Google Chrome
- node.js
- npm 

# コンパイル方法

```bash
git clone https://github.com/wakewakame/SoundGoogleMap
cd SoundGoogleMap
npm install
./node_modules/.bin/webpack
```

これで `./dst/main.js` が生成されます。

# 使い方
1. chromeで`chrome://extensions/`を開きます。
2. `パッケージ化されていない拡張機能を読み込む`を押します。
3. dstフォルダを選択します。

# GoogleMapの改造内容
## 1. 常に60fpsでレンダリングされるようにする
GoogleMapは頂点データの更新や、カメラアングルが変更されない限りはレンダリングを行いません。
そのため、GoogleMapをレンダリングする関数を見つけ、フレームレートが60より高くなったり低くなったりしないように変更しました。
具体的には、レンダリングをしている関数部分を変更し、レンダリングすると同時にレンダリング時刻を、こちらが用意した変数に記録するように変更しました。
さらに、`setInterval`関数により、最後にレンダリングされた時間と現在時刻の差が一定以上ならば、レンダリングを行うようにして、継続的にレンダリングされるようにしました。

## 2. シェーダの書き換え
GoogleMapは建物の描画にWebGLを用いています。
そのため、シェーダを書き換えることができれば、建物の色や形状などを変更させることが可能になります。
そこで、シェーダをコンパイルする関数をフックしてGoogleMapで使用されるすべてのシェーダを書き換えられるようにしました。

また、GoogleMapのシェーダは、同一のソースコードでも、複数回コンパイルされることがあります。
これはシェーダ内に存在する`#ifdef XXX`などを有効にしたり無効にしたりするためだと思います。
建物を表示しているシェーダは2回コンパイルされるようです。
1つ目のシェーダは「カメラの画角が真下から45度までの範囲のとき」という条件で使用されます。
2つ目のシェーダは「カメラの画角が水平線から45度までの範囲のとき」という条件で使用されます。
1つ目のシェーダには先頭に`#define_a;`という行が追加されており、これにより`#ifdef _a`内にある`uniform mat4 u;`という変数が有効になります。
この変数は`attribute`で与えられる頂点を地球の中心を原点とした座標に変換するための行列です。
どちらのシェーダを使用するかは`isVisible`関数が返す値によって切り替えられています。
そのため、`isVisible`関数を書き換えることにより、シェーダ2のみを使用するように変更しました。

## 3. 任意のuniform変数を更新できるように変更
改造したシェーダに任意のデータを送りたいときには`uniform`変数を使います。
この`uniform`変数に値を送るタイミングは基本的にレンダリングの直前です。
そのため、レンダリングの直前に任意の処理を実行させるように改造する必要があります。
GoogleMapはレンダリングを行うときにWebGLの`drawElement`関数を用いています。
その関数が呼ばれている少し前の行に、こちらが定義した関数を呼ばせるように変更しました。
これにより、改造したシェーダに任意のデータを送れるようになりました。
