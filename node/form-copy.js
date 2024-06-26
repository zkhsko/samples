// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-06-25
// @description  try to take over the world!
// @author       You
// @match        https://ones-admin-pro.jiker.cc/permission/company
// @match        https://ones-admin-pro.jiker.com/permission/company
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jiker.com
// @grant        GM.deleteValue
// @grant        GM.getValue
// @grant        GM.listValues
// @grant        GM.setValue
// @grant        GM.getResourceUrl
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

/**
 * 这是一段油猴脚本代码
 * 用来复制一个页面上的数据到另一个页面，跨Tab复制。
 * 只是一个示例，实际使用的时候还是要根据实际情况修改
 * 至少要修改的地方
 * 1、注释中的@match 部分
 * 2、选择器部分
 */

(function () {
    'use strict';
    return;
    if (location.host === 'ones-admin-pro.jiker.cc') {
        let index = 0;
        setInterval(function () {


            let tr = document.getElementsByClassName('selected-body')[0]
                .getElementsByClassName('el-card')[1]
                .getElementsByTagName('tbody')[0]
                .getElementsByTagName('tr');

            let v1 = tr[index].getElementsByTagName('td')[1].getElementsByTagName('div')[0].innerText;
            let v2 = tr[index].getElementsByTagName('td')[2].getElementsByTagName('div')[0].innerText;
            let v3 = tr[index].getElementsByTagName('td')[3].getElementsByTagName('div')[0].innerText;

            GM_setValue('m6QcyPGsFwtkUamq_v1', v1);
            GM_setValue('m6QcyPGsFwtkUamq_v2', v2);
            GM_setValue('m6QcyPGsFwtkUamq_v3', v3);

            if (index < tr.length) {
                index++;
            }
        }, 13000)
    }

    if (location.host === 'ones-admin-pro.jiker.com') {
        setInterval(function () {
            console.log(GM_getValue('m6QcyPGsFwtkUamq_v1'));
            console.log(GM_getValue('m6QcyPGsFwtkUamq_v2'));
            console.log(GM_getValue('m6QcyPGsFwtkUamq_v3'));

            document.getElementsByClassName('el-dialog__body')[0].getElementsByTagName('input')[0].value = GM_getValue('m6QcyPGsFwtkUamq_v1')
            document.getElementsByClassName('el-dialog__body')[0].getElementsByTagName('input')[1].value = GM_getValue('m6QcyPGsFwtkUamq_v2')
            document.getElementsByClassName('el-dialog__body')[0].getElementsByTagName('input')[2].value = GM_getValue('m6QcyPGsFwtkUamq_v3')
        }, 13000)
    }


    // Your code here...
})();