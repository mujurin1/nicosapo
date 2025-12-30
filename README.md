# フォーク追記

これは https://github.com/yurafuca/nicosapo のフォークです\
古くなった API の改修のみを行っています

対応内容
- Manifest v3 への対応（マニフェストの更新と軽い修正のみ. 案外簡単）
- 2025/12/31 時点までのニコニコ API 更新対応（公式、未来の公式タブは未対応）
- scss バンドラーの削除（私の環境で動作しないため. 生成されない css ファイルを最初から dist/ に含めています）

メモ
- [42391ba](https://github.com/mujurin1/nicosapo/commit/42391ba9326cb00a643393d685752af05b06663e) 何故か従来のコードでは `null` が変えるため `localstorage` を直接参照
- データの保存にはローカルストレージを使用（これは従来から）
  - store ライブラリがローカルストレージをラップしたライブラリらしい
- 古いコードは `// old:` を付けてコードベースに残す


# nicosapo

Google Chrome Extension build with React for extending NicoNico Live.

## Install

[Chrome WebStore](https://chrome.google.com/webstore/detail/%E3%83%8B%E3%82%B3%E7%94%9F%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC/kfnogdokhemdbbclknmmjpcnmjmpjknc)

## Feature

1. Popup list of programs
1. Automatic redirect
1. Automatic entry
1. Automatic scroll
1. Search programs
1. Notification bar
    * Show remaining time
    * Show end time
    * Notify extension

## Demo

<img alt="nicosapo" src="./src/video/demo.gif" width='542px'>

## Build

Release:

```
npm run release
```

Build:

```
npm run build
```

Watch:

```
npm run watch
```

## Donate

This application is developed by the user's offer. Please cooperate if you can charge for this extended function. Amazon gift certificates are also welcome.

<a href="http://amzn.asia/7MmmuAz" target="_blank">Amazon Wishlist: Book</a>

<a href="http://amzn.asia/38NVAwa" target="_blank">Amazon Wishlist: Sundries</a>

## Licence

MIT

## Author

<a href="https://twitter.com/yurafuca" target="_blank">@yurafuca</a>
