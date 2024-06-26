

let cnt = 3200;

let min = BigInt("283655874");
let max = BigInt("451485655");

let offset = parseInt((max - min)) / cnt;

let list = [];

for (let i = 1; i <= cnt - 1; i++) {
    let n = min + BigInt(parseInt(offset * i));

    list.push(n.toString());
}

list.push(max.toString());

// for (let i = 1; i < list.length; i++) {
//     console.log((list[i] - list[i - 1]).toString())
// }

// console.log("----------------------------");

for (let i = 0; i < list.length; i++) {
    console.log('DELETE FROM `turtle_alipay_shell_king`.`coin_record` WHERE `id` <= ' + list[i] + ';');
    console.log('select sleep(11);');
}