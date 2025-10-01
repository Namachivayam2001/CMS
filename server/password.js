const bcrypt = require('bcryptjs');

const hashPassword = async function(password) { 
    const salt = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(password, salt);
    console.log(hash_password);
};

hashPassword("admin");  