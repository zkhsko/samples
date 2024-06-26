let userId = 'thisIsUserId';
// 7_kdmdkb83oyvg2ojenvwk
// 8_kgdhy5m6f8by0bo2mi7x
// 9_9vmzuhnoeo13sp6t0095
let pieceId = 'thisIsPieceId';

let platformType = 'thisIsPlatformType';
let orderId = 'thisIsOrderId';

let orderPayTime = 'thisIsOrderPayTime';
let orderPayAmount = 'thisIsOrderPayAmount';

let insertOrderSql = `INSERT INTO user_puzzle_piece_order_record
(app_name, user_id, platform_type, order_id, order_pay_amount, order_pay_time, times, active)
VALUES('weGoodRoot', '${userId}', '${platformType}', '${orderId}', ${orderPayAmount}, '${orderPayTime}', 1, 1);`;

let insertPieceSql = `INSERT INTO user_puzzle_piece_record
(app_name, user_id, activity_id, piece_id, platform_type, order_id, exchanged, exchange_time, active, remark, share_from_id)
VALUES('weGoodRoot', '${userId}', '3', '${pieceId}', '${platformType}', '${orderId}', 0, '1970-01-01 08:00:00', 1, '', 0);`;



console.log(insertOrderSql);
console.log(insertPieceSql);