const environment = require('../environment.js');

exports.MONGODB_URI = 'mongodb+srv://checco:CHEcol_diurywq29@cluster0.lddrl.mongodb.net/shalatic_beta?authSource=admin&replicaSet=atlas-jhkxaz-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';

exports.SUPERUSER_MAIL = [
    'checcobarbieri@gmail.com',
    'astangafirenze@gmail.com'
];

exports.APP_URL = environment === 'dev' ? 'http://localhost:3000/' : 'http://161.35.145.112/';