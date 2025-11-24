const { spawn } = require("child_process");
const path = require("path");

// jarsigner.exe 的路径
const jarsignerPath = path.join(
  "D:",
  "tk",
  "libs",
  "jdk-17.0.12",
  "bin",
  "jarsigner.exe"
);

// APK 文件路径
const apkPath = path.join(__dirname, "../apks", "android-release-unsigned.apk");

// keystore 文件路径
const keystorePath = path.join(
  __dirname,
  "../releases",
  "test-game-release-key.jks"
);

// key alias 和密码
const keyAlias = "test-game-alias";
const storePass = "123456"; // keystore 密码
const keyPass = "123456"; // key 密码（可与 storePass 相同）

// jarsigner 参数
const args = [
  "-verbose",
  "-sigalg",
  "SHA1withRSA",
  "-digestalg",
  "SHA1",
  "-keystore",
  keystorePath,
  "-storepass",
  storePass,
  "-keypass",
  keyPass,
  apkPath,
  keyAlias,
];

// 使用 spawn 并继承 stdio，这样可以在控制台输入密码
const child = spawn(jarsignerPath, args, { stdio: "inherit" });

child.on("exit", (code) => {
  if (code === 0) {
    console.log("APK 签名成功！");
  } else {
    console.error(`jarsigner 进程退出，退出码: ${code}`);
  }
});
