const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Park = require('../models/Parking')
const usersController = {};

usersController.index = (req, res) => {
  console.log('userid: ',req.user.id);
  User.findById(parseInt(req.user.id))
  .then(user => {
    let carInfo = ''
    if(typeof(res.locals.cars)!=='undefined'){
      carInfo = res.locals.cars;
      console.log('setting carInfo. ', carInfo);
    }
    res.render('user',{
      userInfo: user,
      cars: carInfo
    })
  }).catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
};

usersController.findInLocations = (req,res,next) => {
  if(res.locals.streets){
    console.log('Firing findInLocations', res.locals.streets);
    let streets = res.locals.streets.map(function(el,index){
      let num = el.match(/[0-9]+/);
      if(num&&el.match(/str?e?e?t?/i)){
        console.log('yes');
        return `${num} STREET`;
      }else if(num&&el.match(/ave[. n]?/i)){
        console.log('yes avenue');
        return `${num} AVENUE`;
      }else{
        return el.toUpperCase();
      }
    });
    streets = streets.filter(function(el){
      return el !== '';
    });
    let main_st = streets[0];
    let from_st = streets[1];
    let to_st = streets[2];
    console.log('main_st: '+main_st+' from_st: '+from_st+' to_st: '+to_st);
    Park.findInLocations({
      street1:main_st,
      street2:from_st,
      street3:to_st,
    }).then(location => {
      if(location.length > 0){
        console.log(location);
        console.log('Replace order_no string',location[0].order_no.replace(/[ ]+/g,''));
        Park.findInSigns({
          boro: location.boro,
          order_no: location[0].order_no.replace(/[ ]+/g,''),
          sos: location.sos
        }).then(sign => {
          console.log('Sign',sign);
          res.locals.sign = sign;
          next();
        }).catch(err => {
          console.log(err);
          res.status(500).json(err);
        })
      }else{
        res.locals.sign = [{
          sign_description: 'Parking rule not found'
        }];
        next();
      }
    }).catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
  }else{
    next();
  }
}

usersController.returnLocation = (req, res) => {
  console.log('returnLocation sign: ', res.locals.sign);
  console.log('returnLocation streets: ', res.locals.streets);
  res.json(
    {
      streets: res.locals.streets,
      sign: res.locals.sign
    }
  );
}

usersController.create = (req, res) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  User.create({
    username:  req.body.username,
    email: req.body.email,
    password_digest: hash,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  }).then(user => {
    req.login(user, (err) => {
      if (err) return next(err);
      res.redirect('/user');
    });
  }).catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
};

module.exports = usersController;
