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

  // Create a variable to the firebase database
  var database = firebase.database();

  // Create variables and set initial values
  var trainName = "";
  var destination = "";
  var frequency = 0;
  var firstTrainTime = "";

  // Capture Submit button click
  $("#submit-button").on("click", function(event) {
    event.preventDefault();
    // Get values for user input
    trainName = $("#name-input").val().trim();
    destination = $("#destination-input").val().trim();
    frequency = $("#frequency-input").val().trim();
    firstTrainTime = $("#first-input").val().trim();

    // Push user input to the firebase database
    database.ref().push({
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      firstTrainTime: firstTrainTime,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });



  });