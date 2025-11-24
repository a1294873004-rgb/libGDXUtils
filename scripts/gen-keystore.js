const { spawn } = require("child_process");
const path = require("path");
/**
 * 密钥库口令：123456
 * 名字和姓氏：tk
 * 单位：tk
 * 组织: tk
 * 城市：tk
 * 省：tk
 * 国家：CN
 */
const keytoolPath = path.join(
  "D:",
  "tk",
  "libs",
  "jdk-17.0.12",
  "bin",
  "keytool.exe"
);
const keystorePath = path.join(
  "D:",
  "tk",
  "app",
  "libGDX-utils",
  "releases",
  "test-game-release-key.jks"
);

const args = [
  "-genkey",
  "-v",
  "-keystore",
  keystorePath,
  "-keyalg",
  "RSA",
  "-keysize",
  "2048",
  "-validity",
  "10000",
  "-alias",
  "test-game-alias",
];

// spawn 可以直接显示 keytool 的交互提示
const child = spawn(keytoolPath, args, { stdio: "inherit" });

child.on("exit", (code) => {
  console.log(`keytool 进程退出，退出码: ${code}`);
});
