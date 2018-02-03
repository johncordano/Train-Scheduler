  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAtccnFIxn8-nlBgDe4kJLC_3f9deU1s_4",
    authDomain: "train-scheduler-122f0.firebaseapp.com",
    databaseURL: "https://train-scheduler-122f0.firebaseio.com",
    projectId: "train-scheduler-122f0",
    storageBucket: "train-scheduler-122f0.appspot.com",
    messagingSenderId: "66819977638"
  };

  firebase.initializeApp(config);

  // Create a variable for the firebase database
  var dataRef = firebase.database();

  // Create variables for user input and set initial values
  var trainName = "";
  var destination = "";
  var frequency = 0;
  var firstTrainTime = "";

  // Capture Submit button click to get user-input values
  $("#submit-button").on("click", function(event) {
    event.preventDefault();

    trainName = $("#name-input").val().trim();
    destination = $("#destination-input").val().trim();
    frequency = $("#frequency-input").val().trim();
    firstTrainTime = $("#first-input").val().trim();
  });

  // Capture Submit button click to generate values for calculated fields
  $("#submit-button").on("click", function(getTime) {
    event.preventDefault();
    // Create a variable for the current time in milliseconds
    var now = moment().valueOf();
    // Create a variable for the first train time in milliseconds
    var firstTrainTime = document.getElementById('first-input').value;
    firstTrainTime = moment(firstTrainTime).valueOf();
    // Create a variable for the frequency in milliseconds
    var frequency = document.getElementById('frequency-input').value;
    frequency *= 60000;
    // Calculate the minutes-away variable by using the frequency variable, the current time variable, and the first train time variable
    var minutesAway = parseInt((frequency - ((now - firstTrainTime) % frequency)) / 60000);
    // Calculate the next-arrival variable by using the current time variable and the minutes-away variable
    var nextArrival = moment(now + (minutesAway * 60000)).format('h:mm A');
    // Convert the frequency variable from milliseconds to minutes for display
    // purposes
    frequency /= 60000;

    console.log('minutesAway', parseInt(minutesAway));
    console.log('nextArrival', nextArrival);
    console.log('frequency', frequency);

    // Push user input values and calculated values to the firebase database
    dataRef.ref().push({
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      firstTrainTime: firstTrainTime,
      nextArrival: nextArrival,
      minutesAway: minutesAway,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

  });

  // Use the childSnapshot function to insert database content into html page.
  dataRef.ref().on("child_added", function(childSnapshot) {

     $("#schedule-body").append("<tr id='schedule-line'><td id='train-name'> " + childSnapshot.val().trainName + "</td><td id='destination'> " + childSnapshot.val().destination + "</td><td id='frequency'> " + childSnapshot.val().frequency + "</td><td id='next-arrival'> " + childSnapshot.val().nextArrival + "</td><td id='minutes-away'> " + childSnapshot.val().minutesAway + "</td></tr>");          

     // Handle the errors
      }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    
  });

  // Get snapshot content from the data base.
  dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {
    $("#name-input").text(snapshot.val().trainName);
    $("#destination-input").text(snapshot.val().destination);
    $("#frequency-input").text(snapshot.val().frequency);
    $("#first-input").text(snapshot.val().firstTrainTime);
  }); 