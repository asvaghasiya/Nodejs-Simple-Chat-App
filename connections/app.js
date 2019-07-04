module.exports = () => {
    app = express();

    /*
        parsing body datsa request
    */
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ limit: '16mb', extended: false }));

    // parse application/json
    app.use(bodyParser.json({ limit: '16mb' }));

    // all assets will be provided from 'public' folder
    app.use(express.static("public")); 

    // views will be provided from 'views' folder
    app.set('views', 'views'); 

    // selecting view engine as html
    app.set('view engine', 'html'); 

    // view will be rendered using ejs
    app.engine('html', ejs.renderFile); 

    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });

    // All index route will be hanlded here
    app.use('/',require('../routes/index'));
}