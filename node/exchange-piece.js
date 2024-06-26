// 碎片兑换
let userId = 'thisIsUserId';
let tableHash = 'thisIsTableHash';


let pieceIdList = ['thisIsPieceId1', 'thisIsPieceId2', 'thisIsPieceId3'];

// 将碎片设置为已兑换
pieceIdList.forEach((pieceId) => {
    let updatePieceSql = `UPDATE user_puzzle_piece_record SET exchanged=1, exchange_time=now() WHERE id= '${pieceId}';`;
    console.log(updatePieceSql);
});

// 插入一条兑换记录
console.log(`INSERT INTO user_puzzle_piece_exchange_record (app_name, user_id, activity_id, piece_id_list, reward_origin_json) VALUES('weGoodRoot', '${userId}', 3, '${pieceIdList.join(', ')}', '[{"number":"10000","rewardType":"coin"}]');`)

// 查询user_puzzle_piece_exchange_record表刚插入的记录的id
console.log(`select id from user_puzzle_piece_exchange_record where user_id='${userId}' order by id desc limit 1;`);

// 引入readline模块
let readline = require("readline");

// 创建接口实例
let r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

let bizNo = '';


// r1.question("你的名字是? ").then((name) => {
//     console.log(`Hello ${name}!`);
//     rl.close();
//   });

// 调用接口方法
r1.question("请输入bizNo: ", function(line) {
    bizNo = line;
    r1.close;

    console.log(`INSERT INTO coin_record_${tableHash} (userId, coin, subject, bizType, bizNo, details, appName, userLevel) VALUES('${userId}', 10000, '拼图成功奖励', 'PUZZLE_PIECE_EXCHANGE', ${bizNo}, NULL, 'weGoodRoot', 0);`);
    
    console.log(`UPDATE coin_account SET amount=amount+10000, WHERE userId = '${userId}';`)

    process.exit(0);
})
