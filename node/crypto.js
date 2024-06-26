#! node

var crypto = require('crypto');

/**
 * 加密方法
 * @param key 加密key
 * @param iv       向量
 * @param data     需要加密的数据
 * @returns string
 */
var encrypt = function (key, iv, data) {
    var cipher = crypto.createCipheriv('AES-128-CBC', key, iv);
    var crypted = cipher.update(data, 'utf8', 'binary');
    crypted += cipher.final('binary');
    // crypted = new Buffer(crypted, 'binary').toString('base64');
    crypted = Buffer.from(crypted, 'binary').toString('base64');

    // url safe
    crypted = crypted.replace(/\+/g, '-')
    crypted = crypted.replace(/\//g, '_')

    return crypted;
};

/**
 * 解密方法
 * @param key      解密的key
 * @param iv       向量
 * @param crypted  密文
 * @returns string
 */
var decrypt = function (key, iv, crypted) {
    // crypted = new Buffer(crypted, 'base64').toString('binary');

    // url safe
    crypted = crypted.replace(/\-/g, '+')
    crypted = crypted.replace(/_/g, '/')

    crypted = Buffer.from(crypted, 'base64').toString('binary');
    var decipher = crypto.createDecipheriv('AES-128-CBC', key, iv);
    var decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
};

// var key = 'hUwrsVrvRKWoEFCP';
// console.log('加密的key:', key.toString('hex'));
// var iv = 'hUwrsVrvRKWoEFCP';
// console.log('加密的iv:', iv);
// var data = "18834233243";
// console.log("需要加密的数据:", data);
// var crypted = encrypt(key, iv, data);
// console.log("数据加密后:", crypted);
// var dec = decrypt(key, iv, crypted);
// console.log("数据解密后:", dec);


var printHelp = function () {
    console.log('使用示例, crypto.js [AES/ramdom/hash]')
}

var printAESHelp = function () {
    console.log('使用示例, crypto.js AES [beta/prod] [de/en] 数据');
}

var printHashHelp = function () {
    console.log('使用示例, crypto.js hash 数据');
}

var printUserIdHelp = function () {
    console.log('使用示例, crypto.js userId 数据');
}

var hashCode = function (data) {

    let bytes = Buffer.from(data);

    let h = 0;
    for (let i = 0; i < bytes.length; i++) {
        let v = bytes[i];
        h = 31 * h + (v & 0xff);
        h |= 0;
    }

    return h;
}

var random = function (len) {
    if (!len) {
        len = 16;
    }


    var chars = [];

    for (let i = 48; i < 58; i++) {
        chars.push(String.fromCharCode(i));
    }
    for (let i = 65; i < 91; i++) {
        chars.push(String.fromCharCode(i));
    }
    for (let i = 97; i < 123; i++) {
        chars.push(String.fromCharCode(i));
    }

    var result = '';

    for (let i = 0; i < len; i++) {
        let index = parseInt(Math.random() * chars.length);
        result += chars[index];
    }

    console.log(len + "位随机字符: " + result);
}

const args = process.argv.slice(2);

if (args[0] === undefined) {
    printHelp();
    return;
}

if (args[0] == 'AES') {
    let key = "";
    let iv = "";
    let data = "";

    let profile = "";

    if (args[1] === undefined || args[2] === undefined || args[3] === undefined) {
        printAESHelp();
        return;
    }

    if (args[1] == 'beta') {
        profile = "测试";

        key = "8TlgY9Sc1iyJZD2k";
        iv = "8TlgY9Sc1iyJZD2k";
    } else if (args[1] == 'prod') {
        profile = "生产";

        key = "hUwrsVrvRKWoEFCP";
        iv = "hUwrsVrvRKWoEFCP";
    } else {
        printAESHelp();
        return;
    }

    data = args[3];

    if (args[2] == 'en') {
        console.log(profile + ' 加密: ' + data);

        var encrypted = encrypt(key, iv, data);
        console.log("加密后:", encrypted);
    } else if (args[2] == 'de') {
        console.log(profile + ' 解密: ' + data);

        var decrypted = decrypt(key, iv, data);
        console.log("解密后:", decrypted);
    } else {
        printAESHelp();
    }
} else if (args[0] == 'random') {
    if (args[1] === undefined) {
        random();
    } else {
        random(parseInt(args[1]));
    }
} else if (args[0] == 'hash') {
    if (args[1] == undefined) {
        printHashHelp();
        return;
    }

    let data = args[1];
    console.log(Math.abs(parseInt(hashCode(data) / 2 % 16)));
} else if (args[0] == 'userId') {
    if (args[1] == undefined) {
        printUserIdHelp();
        return;
    }

    key = "CVn5heT5Y62JJ0o5";
    iv = "CVn5heT5Y62JJ0o5";

    data = args[1];

    data = data.replaceAll('.', '=');

    var decrypted = decrypt(key, iv, data);
    console.log("userId明文:", decrypted);

} else {

}

