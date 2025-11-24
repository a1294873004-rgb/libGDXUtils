## apk 密钥和 签名逻辑
```js

// ===============================
// 1️⃣ 生成密钥对（私钥 + 公钥）
// ===============================
function generateKeyPair() {
    // 私钥随机生成，长度通常 2048 位
    privateKey = RandomBigInteger(2048)
    
    // 公钥由私钥计算而来（例如 RSA: 公钥 = privateKey^e mod n）
    publicKey = computePublicKey(privateKey)

    // 将私钥和公钥封装到一个安全容器（keystore）
    keystore = {
        alias: "my-key-alias",
        privateKey: encrypt(privateKey, keystorePassword),
        certificate: createSelfSignedCertificate(publicKey, identityInfo) // CN, OU, O...
    }
    
    return keystore
}

// ===============================
// 2️⃣ 对 APK 文件签名
// ===============================
function signAPK(apkFile, keystore) {
    // 读取 APK 文件字节
    apkData = readFileBytes(apkFile)
    
    // 计算每个文件或整个 APK 的摘要（Digest）
    digest = hash(apkData, "SHA-256")
    
    // 使用 keystore 的私钥对摘要进行签名
    signature = encryptWithPrivateKey(digest, decrypt(keystore.privateKey, keystorePassword))
    
    // 将签名和证书写入 APK 的 META-INF 目录
    apkFile.META_INF.signature = signature
    apkFile.META_INF.certificate = keystore.certificate
    
    return apkFile
}

// ===============================
// 3️⃣ 对 APK 进行对齐（优化，可选）
// ===============================
function zipAlign(apkFile) {
    // 遍历 APK 内每个文件
    for file in apkFile.files:
        // 将文件内容起始地址按 4 字节边界对齐
        file.offset = align4Bytes(file.offset)
    return apkFile
}

// ===============================
// 4️⃣ 安装时验证签名
// ===============================
function verifyAPK(apkFile, installedAPK) {
    // 从 APK 中读取签名和证书
    signature = apkFile.META_INF.signature
    certificate = apkFile.META_INF.certificate
    publicKey = certificate.publicKey
    
    // 计算 APK 摘要
    digest = hash(apkFile, "SHA-256")
    
    // 用公钥解密签名，得到原始摘要
    decryptedDigest = decryptWithPublicKey(signature, publicKey)
    
    // 验证摘要是否一致
    if digest != decryptedDigest:
        return false // APK 被篡改或签名不合法
    
    // 如果系统已有安装，则对比公钥证书是否一致
    if installedAPK != null:
        if installedAPK.META_INF.certificate.publicKey != publicKey:
            return false // 不同开发者签名，无法升级
    
    return true // 安装或升级合法
}

// ===============================
// 5️⃣ 完整流程（原理）
keystore = generateKeyPair()
signedAPK = signAPK(unsignedAPK, keystore)
alignedAPK = zipAlign(signedAPK)

// 安装到手机时
if verifyAPK(alignedAPK, existingInstalledAPK):
    install(alignedAPK)
else:
    reject("签名验证失败")


```

## 公钥和私钥 原理

```js
// ===============================
// 1️⃣ 生成密钥对（私钥 + 公钥）
// ===============================
function generateKeyPair() {
    // 随机生成私钥（大整数）
    const privateKey = randomBigInt(2048)  

    // 根据非对称算法（例如 RSA）生成公钥
    const publicKey = computePublicKey(privateKey)

    // 封装为证书（包含公钥和开发者身份）
    const certificate = {
        publicKey,
        identity: {
            CN: "Developer Name",
            OU: "Dev",
            O: "Company",
            L: "City",
            ST: "State",
            C: "CN"
        }
    }

    return { privateKey, publicKey, certificate }
}

// ===============================
// 2️⃣ APK 签名原理
// ===============================
function signAPK(apkData, privateKey) {
    // 计算 APK 的哈希（摘要）
    const digest = hash(apkData, "SHA-256")

    // 用私钥加密哈希 → 得到签名
    const signature = encryptWithPrivateKey(digest, privateKey)

    // 将签名嵌入 APK
    apkData.signature = signature

    return apkData
}

// ===============================
// 3️⃣ 安装或验证 APK 原理
// ===============================
function verifyAPK(apkData, certificate) {
    const signature = apkData.signature
    const publicKey = certificate.publicKey

    // 用公钥解密签名，得到原始哈希
    const originalDigest = decryptWithPublicKey(signature, publicKey)

    // 重新计算 APK 哈希
    const digest2 = hash(apkData, "SHA-256")

    // 验证是否一致
    if (originalDigest === digest2) {
        return true  // APK 未被篡改
    } else {
        return false // APK 签名不合法
    }
}

// ===============================
// 4️⃣ 数学可逆性演示（原理）
// ===============================
function demonstrateReversibility(digest, privateKey, publicKey) {
    // 私钥加密 → 公钥解密
    const signature = encryptWithPrivateKey(digest, privateKey)
    const recoveredDigest1 = decryptWithPublicKey(signature, publicKey)

    // 公钥加密 → 私钥解密（理论可行）
    const encrypted = encryptWithPublicKey(digest, publicKey)
    const recoveredDigest2 = decryptWithPrivateKey(encrypted, privateKey)

    console.log(recoveredDigest1 === digest) // true
    console.log(recoveredDigest2 === digest) // true
}

// ===============================
// 5️⃣ 使用流程
// ===============================
const { privateKey, publicKey, certificate } = generateKeyPair()
const unsignedAPK = loadAPK("app-release-unsigned.apk")

// 签名
const signedAPK = signAPK(unsignedAPK, privateKey)

// 验证
if (verifyAPK(signedAPK, certificate)) {
    console.log("签名验证通过，可以安装")
} else {
    console.log("签名验证失败，拒绝安装")
}

// 演示可逆性（数学原理）
demonstrateReversibility(hash(unsignedAPK), privateKey, publicKey)


```