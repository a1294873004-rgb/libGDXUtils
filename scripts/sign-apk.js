const { spawn } = require("child_process");
const path = require("path");

const env = { ...process.env };
env.JAVA_HOME = "D:\\tk\\libs\\jdk-17.0.12";
env.PATH = `${env.JAVA_HOME}\\bin;${env.PATH}`;

const apksignerPath = path.join(
  "C:",
  "Users",
  "Administrator",
  "AppData",
  "Local",
  "Android",
  "Sdk",
  "build-tools",
  "35.0.0",
  "apksigner.bat"
);

const unsignedApkPath = path.join(
  __dirname,
  "../apks",
  "android-release-unsigned.apk"
);
const signedApkPath = path.join(
  __dirname,
  "../apks",
  "android-release-signed.apk"
);

const keystorePath = path.join(
  __dirname,
  "../releases",
  "test-game-release-key.jks"
);
const keyAlias = "test-game-alias";
const storePass = "123456";

const args = [
  "sign",
  "--ks",
  keystorePath,
  "--ks-key-alias",
  keyAlias,
  "--ks-pass",
  `pass:${storePass}`,
  "--v1-signing-enabled",
  "true",
  "--v2-signing-enabled",
  "true",
  "--out",
  signedApkPath, // 指定输出新 APK
  unsignedApkPath,
];

const child = spawn(apksignerPath, args, {
  stdio: "inherit",
  shell: true,
  env,
});

child.on("exit", (code) => {
  if (code === 0) {
    console.log("APK 签名成功！输出文件:", signedApkPath);
  } else {
    console.error(`apksigner 进程退出，退出码: ${code}`);
  }
});
