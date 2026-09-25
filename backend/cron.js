const cron = require('node-cron');
const { fetchMaharashtraData } = require('./services/agmarknet');

// रोज सकाळी 8:00 वाजता (IST)
cron.schedule('0 8 * * *', async () => {
  console.log('');
  console.log('========================================');
  console.log('⏰ रोजचा Agmarknet sync सुरू...');
  console.log('⏰ वेळ:', new Date().toLocaleString('mr-IN'));
  console.log('========================================');
  
  const count = await fetchMaharashtraData();
  
  console.log(`✅ ${count} नोंदी अपडेट झाल्या`);
  console.log('========================================');
  console.log('');
}, {
  timezone: 'Asia/Kolkata'
});

console.log('⏰ Cron job चालू — रोज सकाळी 8:00 वाजता');