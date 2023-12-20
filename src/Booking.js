import React from 'react'
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import Calendar from 'react-calendar';
import { collection, addDoc } from "firebase/firestore"; 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjrHfioKOyxBeJPcp4e4oaUVmuw2R2JEs",
  authDomain: "freewayscubadiving.firebaseapp.com",
  projectId: "freewayscubadiving",
  storageBucket: "freewayscubadiving.appspot.com",
  messagingSenderId: "630194276876",
  appId: "1:630194276876:web:bba8e380ac7fc6352abc29"
};


function Booking() {
    const [step, setStep] = useState(0)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [code, setCode] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [activity, setActivity] = useState('')
    const [divingCourse, setDivingCours] = useState('')
    const [lastDive, setLastDive] = useState('')
    const [lastCertification, setLastCertification] = useState('')
    const [divingActivity, setDivingActivity] = useState('')
    const [numOfPeople, setNumOfPeople] = useState('')
    const [tour, setTour] = useState('')
    const [date, setDate] = useState('')
  
    const [showConfirmation, setShowConfirmation] = useState(false)

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);


    async function createReservation(){
        const docRef = await addDoc(collection(db, "Bookings"), {
          firstName: firstName, 
          lastName: lastName, 
          code: code, 
          phone: phone, 
          email: email, 
          activity: activity, 
          divingCourse: divingCourse, 
          lastDive: lastDive, 
          lastCertification: lastCertification,
          divingActivity: divingActivity, 
          numOfPeople: numOfPeople, 
          tour: tour, 
          date:date, 
          status:'Pending'      
        });


        const postData = {
          firstName: firstName, 
          lastName: lastName, 
          code: code, 
          phone: phone, 
          email: email, 
          activity: activity, 
          divingCourse: divingCourse, 
          divingActivity: divingActivity, 
          tour: tour, 
          date:date, 
        };
        
        const requestOptions = {
          method: 'POST',
          headers: {'Content-Type': 'application/json',},
          body: JSON.stringify(postData),
        };
        
        try {
          const response = await fetch('https://mailer-freeway.vercel.app/email', requestOptions);
        
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Response from server:', data);
        } catch (error) {
          console.error('Error sending POST request:', error.message);
        }
        



        setShowConfirmation(true)
    }

  return (
    <div>
       <div className='wrapper'>
        <h2> Book Now </h2>
        <div className='steps' style={{display: step == 0? "block":"none"}}>
            <p> Contact Information: </p>
            <input type='text' placeholder='First Name' onChange={(e) => setFirstName(e.target.value)} />
            <input type='text' placeholder='Last Name' onChange={(e) => setLastName(e.target.value)}  />
            <div className='grid-phone'>
              <input type='tel' placeholder='+1'  onChange={(e) => setCode(e.target.value)} />
              <input type='tel' placeholder='Phone'  onChange={(e) => setPhone(e.target.value)}  />
            </div>   
            <input type='email' placeholder='Email'  onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className='steps' style={{display: step == 1? "block":"none"}}>
            <p> Choose an activity: </p>
            <select onChange={(e)=>setActivity(e.target.value)}>
              <option selected disabled> Select and option: </option>
              <option> Diving Courses </option>
              <option> Diving </option>
              <option> Packages & Tours </option>
            </select>
            <div style={{display: activity == 'Diving Courses' ? "block":"none"}}>
              <h3> Select Diving Course: </h3>
              <select onChange={(e)=>setDivingCours(e.target.value)}>
                <option selected disabled> Select an activity: </option>
                <option> Discovey Scuba Diving</option>
                <option> Open Water Scuba Diving</option>
                <option> Advanced Diver</option>
                <option> Scuba Refresher</option>
                <option> Sidemount Diver</option>
                <option> Nitrox Diver</option>
              </select>
              <h3> When was your last dive: </h3>
              <select onChange={(e)=>setLastDive(e.target.value)}>
                <option selected disabled> Select an option: </option>
                <option> This is my first time </option>
                <option> 1 month ago</option>
                <option> Less than 6 months </option>
                <option> More than 6 months </option>
              </select> 
              <h3> Last Certification: </h3>
              <select onChange={(e)=>setLastCertification(e.target.value)}>
                <option selected disabled> Select an option: </option>
                <option>I'm not certificated</option>
                <option>Open Water</option>
                <option> Open Water Advanced </option>
                <option> Rescue Diver </option>
              </select> 
              <h3> Select a date to take the course: </h3>
              <input type='date' onChange={(e)=>setDate(e.target.value)}/>
            </div>
            <div style={{display: activity == 'Diving' ? "block":"none"}}>
              <h3> Select Diving Activity: </h3>
              <select onChange={((e)=>setDivingActivity(e.target.value))}>
                <option selected disabled> Select an activity: </option>
                <option> Cenote Diving </option>
                <option> Reef Diving </option>
                <option> Cozumel Diving </option>
                <option> Shipwreck Diving </option>
                <option> BullShark Dive </option>
                <option> Night Diving </option>
                <option> Underwater Museum Diving </option>
              </select>
              <h3> How many people:</h3>
              <input type='tel' placeholder='Num of persons' onChange={(e)=>setNumOfPeople(e.target.value)}/>
              <h3> Select a date: </h3>
              <input type='date' onChange={(e)=>setDate(e.target.value)}/>
            </div>
            <div style={{display: activity == 'Packages & Tours' ? "block":"none"}}>
              <h3> Select a Package : </h3>
              <select onChange={(e)=>setTour(e.target.value)}>
                <option selected disabled> Select a tour: </option>
                <option> Cavern Diving Package </option>
                <option> Diving Holidays </option>
                <option> Diving Retreat Experience </option>
                <option> 3 Cenotes Snorkeling Tour </option>
                <option> Whale Shark Snorkeling Tour </option>
                <option> Yal ku lagoon Snorkeling Tour</option>
              </select>
              <h3> How many people:</h3>
              <input type='tel' placeholder='Num of persons' onChange={(e)=>setNumOfPeople(e.target.value)}/>
              <h3> Select a date: </h3>
              <input type='date' onChange={(e)=>setDate(e.target.value)}/>
            </div>
        </div>
        <div className='steps' style={{display: step == 2? "block":"none"}}>
          <p> Summary :</p>
          <h4> Contact Information :</h4>
          <h3><b>Full Name:</b> {firstName + ' ' + lastName }</h3>
          <h3><b>Phone:</b> {code + ' ' + phone }</h3>
          <h3><b>Email:</b> {email }</h3>
          <h4> Activity: </h4>
          <div style={{display: activity == "Diving Courses" ? "block":"none"}}>
            <h3><b>Type:</b> {activity}</h3>
            <h3><b>Course:</b> {divingCourse}</h3>
            <h3><b>Last Dive:</b> {lastDive}</h3>
            <h3><b>Last Certification:</b> {lastCertification}</h3>
          </div>
          <div style={{display: activity == "Diving" ? "block":"none"}}>
            <h3><b>Type:</b> {activity}</h3>
            <h3><b>Diving:</b> {divingActivity}</h3>
            <h3><b>How many people:</b> { numOfPeople} {numOfPeople > 1 ?"persons" : "person"}</h3>
          </div>
          <div style={{display: activity == "Packages & Tours" ? "block":"none"}}>
            <h3><b>Type:</b> {activity}</h3>
            <h3><b>Package:</b> {divingActivity}</h3>
            <h3><b>How many people:</b> { numOfPeople} {numOfPeople > 1 ?"persons" : "person"}</h3>
          </div>
          <h3><b>Date:</b> {date}</h3>
          
          <button onClick={()=>createReservation()}> Book Now</button>
        </div>        
        <div className='nav-btns'>
          <button onClick={()=>setStep(step -1)} style={{display: step > 0 ? "block":"none"}}> Back  </button>
          <button onClick={()=>setStep(step +1)} style={{display: step < 2 ? "block":"none"}}> Next  </button>
        </div>
      </div>

      <div className='confirmation' style={{display: showConfirmation? "flex":"none"}}>
          <i className="bi bi-check2-circle checkIcon"></i>
          <h2> Thanks !</h2>
          <p> Reservation sent successfully !</p>
      </div>
    </div>
  )
}

export default Booking
