const costSms = (length) => {
   const limit = 160 
   const cost = 35
   
   const smsCount = Math.ceil(length / limit)
   const price =  smsCount * cost
   return price;
};


module.exports = costSms