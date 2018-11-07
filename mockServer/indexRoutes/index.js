const express = require('express')
const router = express.Router()
const userRouter = require('../mockDefine/user.js');
const fs = require('fs');
const path = require('path');
const mockDir = path.join(__dirname, '../mockDefine');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})

// 注册mockDefine下定义的路由
fs.readdirSync(mockDir).forEach(function (mockFileName) {
    const pathHandlerMap = require(path.join(mockDir, mockFileName));
    Object.keys(pathHandlerMap).forEach(path => {
        const handler = userRouter[path];
        router.all(path, function (req, res) {
            const rlt = handler(req, res);
            res.json(rlt);
        })
    })
})

module.exports = router;