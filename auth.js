function signIn(){

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  if(email && password){
    console.log("Hi");
    console.log(email);
    var e = 0;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      console.log(error); // Handle Errors here.
      e = 1;
      console.log(e);
      var errorCode = error.code;
      var errorMessage = error.message;
    });
    console.log(e);
    if(!e){
      var user = firebase.auth().currentUser;
      var uid;
      //console.log(e.errorCode);
      if (user != null) {
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                        // this value to authenticate with your backend server, if
                        // you have one. Use User.getToken() instead.
      }
      //console.log(document.getElementById("test").innerHTML);
      //document.getElementById("test").innerHTML = uid;
      window.location.href = 'home_2.html' + '?uid=' + uid;
    }
  }
}
