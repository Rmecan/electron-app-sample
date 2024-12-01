# Node.js / npmをインストールする（for Windows）

* https://qiita.com/taiponrock/items/9001ae194571feb63a5e
* https://qiita.com/gahoh/items/8444da99a1f93b6493b4

# Vite+Electronをインストール

* https://electron-vite.org/

```
C:\Users\xxxx\Desktop\hogehoge>npm create @quick-start/electron@latest
Need to install the following packages:
@quick-start/create-electron@1.0.24
Ok to proceed? (y) y


> npx
> create-electron

√ Project name: ... electron-app
√ Select a framework: » vanilla
√ Add TypeScript? ... No / Yes
√ Add Electron updater plugin? ... No / Yes
√ Enable Electron download mirror proxy? ... No / Yes

Scaffolding project in C:\Users\xxxx\Desktop\hogehoge\electron-app...

Done. Now run:

  cd electron-app
  npm install
  npm run dev


C:\Users\xxxx\Desktop\hogehoge>cd electron-app

C:\Users\xxxx\Desktop\hogehoge\electron-app>npm install
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
npm warn deprecated boolean@3.2.0: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.

> electron-app@1.0.0 postinstall
> electron-builder install-app-deps

  • electron-builder  version=24.13.3
  • loaded configuration  file=C:\Users\xxxx\Desktop\hogehoge\electron-app\electron-builder.yml

added 437 packages, and audited 438 packages in 41s

78 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

# Database接続テスト

* https://qiita.com/watmot/items/cab267a308fae5967386

```
C:\Users\xxxx\Desktop\hogehoge>cd electron-app

C:\Users\xxxx\Desktop\hogehoge\electron-app>npm install -S sqlite3
npm warn deprecated @npmcli/move-file@1.1.2: This functionality has been moved to @npmcli/fs
npm warn deprecated npmlog@6.0.2: This package is no longer supported.
npm warn deprecated are-we-there-yet@3.0.1: This package is no longer supported.
npm warn deprecated gauge@4.0.4: This package is no longer supported.

added 86 packages, and audited 524 packages in 6s

81 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

# Electronでアプリ作成3　ElectronでSqlite3を操作

* https://qiita.com/watmot/items/cab267a308fae5967386
* https://gridjs.io/docs/install

```
C:\Users\xxxx\Desktop\hogehoge\electron-app>npm install gridjs --save

added 2 packages, and audited 526 packages in 1s

82 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```