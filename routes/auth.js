var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var request = require('request');
var cheerio = require('cheerio');

router.post('/linkedin',function(req,res) {
  var token = jwt.sign(req.body, 'SECRET_KEY');
  res.json(token);
});

router.get('/work-history', function(req,res) {
  try {
    jwt.verify(req.query['token'], 'SECRET_KEY', function(err, decoded) {
      if(err) { return res.json({ success: false, message: 'Failed to authenticate token.' }); }
      request(decoded.profile, function(error, response, html){
        if(!error){
          var $ = cheerio.load(html);
          var experience = $('#background-experience');
          fetchScrape($,experience,function(a) {
            res.json({ success: true, data: a });
          });          
        }
      });
    });
  } catch (err) { console.log(err); }
});

router.post('/verify',function(req,res) {
  try {
    jwt.verify(req.body.token, 'SECRET_KEY', function(err, decoded) {
      if(err) { return res.json({ success: false, message: 'Failed to authenticate token.' }); }
      res.json({ success: true, message: 'User is authenticated' });
    });
  } catch (err) { console.log(err); }
  
});

function fetchScrape($,experience,cb) {
  var exp = [];
  experience.children('div').each(function(i,v) {          
    exp.push({
      job: $(this).find('h4').text(),
      company: $(this).find('h5').text(),
      time: $(this).find('.experience-date-locale').text(),
      description: $(this).find('p.description').text()
    });            
  });
  cb(exp)
}

module.exports = router;