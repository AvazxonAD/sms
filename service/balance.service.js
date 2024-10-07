const pool = require('../config/db')
const asyncFunctionHandler = require('../middlewares/asyncFunctionHandler')
const axios = require('axios')
const Encryptor = require('simple-encryptor')

const getBalance = asyncFunctionHandler(async () => {
    try {
        const encryptor = Encryptor(process.env.HASH_KEY);
        const data = {
            username: process.env.UNIQUE_USERNAME, 
            id: process.env.ID         
        }
        const key = encryptor.encrypt(data);
        const response = await axios.get('http://147.45.107.174:5000/balance/get', {
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS}` 
            },
            params: {
                key 
            }
        });

        return response.data.data;
    } catch (error) {
        console.error(`Xato yuz berdi: ${error.response ? error.response.status : error.message}`);
        throw new Error('So`rovda xatolik yuz berdi');
    }
});

const updateBalance = asyncFunctionHandler(async (balance) => {
    try {
        const encryptor = Encryptor(process.env.HASH_KEY);
        const data = {
            username: process.env.UNIQUE_USERNAME, 
            id: process.env.ID         
        }
        const key = encryptor.encrypt(data); 

        const resData = { balance_value: balance }; 
        
        const response = await axios.put('http://147.45.107.174:5000/balance/update', resData, { 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.ACCESS}` 
            },
            params: {
                key 
            }
        });

        return response.data.data; 
    } catch (error) {
        console.error(`Xato yuz berdi: ${error.response ? error.response.status : error.message}`);
        throw new Error('So`rovda xatolik yuz berdi');
    }
});


module.exports = {
    getBalance,
    updateBalance
}