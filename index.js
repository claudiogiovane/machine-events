const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const WebSocket = require('ws')
const url = 'ws://machinestream.herokuapp.com/ws'
var connection = new WebSocket(url)

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// Connection to database
mongoose
  .connect(
    'mongodb://mongo:27017/machine-events',
    { useNewUrlParser: true }
  )
  .then(() => console.log('Connected to database...'))
  .catch(err => console.log(err));

const machines = require('./models/Machines');
const events = require('./models/Events');

//Websocket streaming function
function streaming(){
  connection.onopen = () => {
    console.log('Streaming data is ready!')
  }
  
  connection.onerror = (error) => {
    console.log(`WebSocket error: ${error}`)
  }
  
  connection.onmessage = (e) => {
    console.log('Realtime streamming has being received.')
    const data = JSON.parse(e.data);
    
    const event = new events({
                 _id: data.payload.id, 
                 machine_id: data.payload.machine_id,
                 status: data.payload.status, 
                 timestamp: data.payload.timestamp
                })
         
    event.save()
        .then((docs)=>{
          if(docs) {
            console.log("Event successfully inserted!")
          }
        }).catch((err)=>{
          console.log(err);
        })

    machines.findOneAndUpdate(
      {_id: data.payload.machine_id},
      {status: data.payload.status},
      {upsert:true, new: true})   
      .then((docs)=>{
        if(docs) {
          console.log("Machine successfully updated!")
        }
    }).catch((err)=>{
      console.log(err);
    })
  }  
}

connection.onclose = (e)  => {
  console.log(`WebSocket close with code: ${e.code}`)
  connection = null;
  setTimeout(streaming(), 6000);
} 

//Routes configuration
app.get('/machines', (req, res) => {
  machines.find()
    .then(machines => res.send(machines))
    .catch(err => res.status(404).json({ msg: 'No machines found' }));
});

app.get('/events', (req, res) => {
  events.find()
    .then(events => res.send(events))
    .catch(err => res.status(404).json({ msg: 'No events found' }));
});

const port = 3000;

app.listen(port, () => console.log('Server running...'));

streaming()