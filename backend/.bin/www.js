const { port } = require('../config');

const app = require('../app');
const db = require('../db/models');


//Authenticate connection to DB
db.sequelize
    .authenticate()
    //Passes - Print that we passed and start listening to our defined port in config
    .then(() => {
        console.log('Database connection success! Sequelize is ready to use...');
        app.listen(port, () => console.log(`Listening on port ${port}...`));
    })
    .catch((err) => {
        //Fails - Log the error
        console.log('Database connection failure.');
        console.error(err);
    });
