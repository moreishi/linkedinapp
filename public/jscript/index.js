$(document).ready(function() {
      // Authenticate      

      if(!localStorage.getItem('token')) { 
        $('#logout').addClass('hide');
        $('#authorize').removeClass('hide');
        $('.thumb').removeClass('hide');
      }

      $('#logout').click(function() {
        localStorage.removeItem('token');
        setTimeout(function() {
          location.reload();
        }, 500);
      });

      $('#authorize').click(function(e) {
        e.preventDefault();
        if(!IN.User.isAuthorized()) {
          IN.User.authorize(function(){
            // on success try to login
            auth();
          }, function() {});
        } else {
          auth();
        }

      });

    });
    
    // preload functions

    function isAuthorized() {
      IN.Event.on(IN, "auth", function() {
        if(localStorage.getItem('token')) { 
          authenticateLinkedIn(function(people) {
            var user = people.values[0];
            $('.name').append(people.values[0].firstName + ' ' + people.values[0].lastName);
            $('.industry').append(people.values[0].industry);
            $('.pictureUrl').attr('src',people.values[0].pictureUrl);
          });
          ajaxRequest('/auth/verify','POST',{token: localStorage.getItem('token')},function(a) {            
            fetchWorkHistory();
            $('.loader').removeClass('hide');
            $('.work-history').addClass('hide');
          });
        }
      });
    }

    function ajaxRequest(url,method,data,cb) {
      $.ajax({
        type: method,
        dataType: "json",
        url: url,
        data: data,
        success: function(e) {
          cb(e);
        }
      });
    }

    function fetchWorkHistory() {
      ajaxRequest('/auth/work-history','GET',{ token: localStorage.getItem('token') },function(a) {
        a.data.map(function(val,key) {            
          $('.work-history').append('<a href="#" class="list-group-item"><h4 class="list-group-item-heading">' + val.job + '</h4><p class="list-group-item-text">'+val.company+'</p><p><small>'+ val.time +'</small></p></a>');
        });
        $('.loader').addClass('hide');
        $('.work-history').removeClass('hide');
        $('#logout').removeClass('hide');
        $('#authorize').addClass('hide');
        $('.thumb').addClass('hide');
      });
    }

    function authenticateLinkedIn(callback) {
      IN.API.Profile("me")
      .fields("firstName", "lastName", "industry","positions","specialties","summary","public-profile-url","picture-url","id")
      .result(function(people) {
        callback(people);
      });
    }

    function auth() {
      authenticateLinkedIn(function(people) {
        var user = people.values[0];
        ajaxRequest('/auth/linkedin','POST',{user_id: user.id, profile: user.publicProfileUrl }, function(a) {
          localStorage.setItem("token", a);
          fetchWorkHistory(people.values[0].publicProfileUrl);
          $('.loader').removeClass('hide');
          setTimeout(function() {
            $('.name').append(people.values[0].firstName + ' ' + people.values[0].lastName);
            $('.industry').append(people.values[0].industry);
            $('.pictureUrl').attr('src',people.values[0].pictureUrl);
          }, 500);
        });
      });
    }