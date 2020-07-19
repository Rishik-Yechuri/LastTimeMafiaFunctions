const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { firebaseConfig } = require('firebase-functions');
admin.initializeApp();
const db = admin.firestore();
const app = express();
const gameCODE = '';
let FieldValue = admin.firestore.FieldValue;
 
exports.addToken = functions.https.onCall(async(data, context) => {
 const user = {
    //"kring":data.token
 };
 //if(await db.collection(data.gameID).doc("usertokens"))
 //await db.collection(data.gameID).doc("usertokens").set(user);
 //await db.collection(data.gameID).doc("usertokens").update({[data.name]:data.token});
 await db.collection(data.gameID).doc("usertokens").update({[data.name]:data.token});
  var doubleToken;
 await db
 .collection(data.gameID)
 .doc('hosttoken')
 .get()
 .then((doc) => {
   if (!doc.exists) {
     throw new functions.https.HttpsError("invalid-argument", "User doesn't exist in db!");
   } else {
       doubleToken = doc.data().token
       return Promise
   }
 });
 var message = {
   data: {
     purpose:"registername",
     name:data.name,
     token:data.token
     //[data.name]:data.token
   },
   token:doubleToken
 };
// Send a message to the device corresponding to the provided
// registration token.
admin.messaging().send(message)
 .then((response) => {
   console.log('Successfully sent message:', response);
   return Promise;
   // Response is a message ID string.
 })
 .catch((error) => {
   console.log('Error sending message:', error);
 });
 //return Promise;
});
exports.bandageFunction = functions.https.onCall(async(data,context) =>{
  //Literally does nothing and the only reason this exists is because a function needs to be called just cause
})
exports.sendMessage = functions.https.onCall(async(data,context) =>{
var permToken = ""
permToken = data.token
var registrationToken = data.token;
if(permToken.toString() === 'host'){
 await db.collection(data.gameCode).doc("hosttoken").get()
.then((doc) => {
   if (!doc.exists) {
     throw new functions.https.HttpsError("invalid-argument", "User doesn't exist in db!");
   } else {
     registrationToken = doc.data().token
     return Promise
   }
 });
}else{
  await db.collection(data.gameCode).doc("usertokens").get()
.then((doc) => {
   if (!doc.exists) {
     throw new functions.https.HttpsError("invalid-argument", "User doesn't exist in db!");
   } else {
     const data = doc.data();
     registrationToken = data.token
     return Promise
   }
 });
}
console.log('Token:',registrationToken);
var message = {
 data: {
   purpose: data.purpose,
   message: data.message,
   name: data.clientname
 },
 token: registrationToken
};
// Send a message to the device corresponding to the provided
// registration token.
admin.messaging().send(message)
 .then((response) => {
   // Response is a message ID string.
   console.log('Successfully sent message:',registrationToken);
   return Promise;
 })
 .catch((error) => {
   console.log('Error sending message:', error);
 });
 
});
 
exports.createGame = functions.https.onCall(async(data,context) => {
 const user = {
};
const returnObject = {
   gameID:""
};
 const randomCode = [...Array(4)].map(i=>(~~(Math.random()*26)).toString(26)).join('')
 await db.collection(randomCode).doc("usertokens").set(user)
 await db.collection(randomCode).doc("hosttoken").set(user)
 await db.collection(randomCode).doc("hosttoken").update({"token":data.token})
 //return randomCode;
 returnObject.gameID = randomCode;
 return Promise.resolve(returnObject)
 .then(function(value){
   //return value
   return {
     gameID:returnObject.gameID
  }
 })
 .catch(error =>{
   response.status(500).send(error)
 })
 //return Promise;
});
 
/*exports.tellHostAboutJoinedClients = functions.database.ref('/{roomID}/usertokens/')
.onCreate((snapshot,context) => {
 const data = snapshot.val()
 const newName = data.
})*/
//input: userId; outpus: lastName
exports.getTheLastNamePlease = functions.https.onCall(async(data, context) => {
 if (!data.userId) {
   throw new functions.https.HttpsError("invalid-argument", "Missing user ID!");
 }
 let userId = data.userId;
const basic = {
   returnValue :"water"
};
 await db
       .collection('users')
       .doc('petrolguy')
       .get()
       .then((doc) => {
         if (!doc.exists) {
             basic.returnValue = "water"
             /*return{
                 firstNumber: 'water'
               }*/
           throw new functions.https.HttpsError("invalid-argument", "User doesn't exist in db!");
         } else {
             basic.returnValue = doc.data().lastName
             return Promise
           /*return {
               firstNumber: doc.data().lastName
           }*/
         }
       });
       return {
           lastName : basic.returnValue
         };
           //const lastName = await db.collection("users").doc("petrolguy").data.lastName
           //return{lastName : lastName}
});
 
exports.deleteUser = functions.https.onCall(async(data, context) => {
 if (!data.userId) {
   throw new functions.https.HttpsError("invalid-argument", "Missing user ID!");
 }
 let cityRef = db.collection('users').doc('dieselguy');
 
// Remove the 'capital' field from the document
let removeCapital = cityRef.update({
 lastName: FieldValue.delete()
});
});
 
 
