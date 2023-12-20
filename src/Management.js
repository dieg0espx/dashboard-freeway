import React, { useEffect, useState } from "react";
import logo from "./images/freewayLogo.png";
import divider from "./images/divider.png";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjrHfioKOyxBeJPcp4e4oaUVmuw2R2JEs",
  authDomain: "freewayscubadiving.firebaseapp.com",
  projectId: "freewayscubadiving",
  storageBucket: "freewayscubadiving.appspot.com",
  messagingSenderId: "630194276876",
  appId: "1:630194276876:web:bba8e380ac7fc6352abc29",
};

function Management() {
  const [reservations, setReservations] = useState([]);
  const [currentReservation, setCurrentReservation] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [filter, setFilter] = useState(1);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  useEffect(() => {
    getReservations();
  }, []);

  useEffect(()=>{
    const themeColorMetaTag = document.querySelector('meta[name="theme-color"]');
    if(showPopup == true){
        themeColorMetaTag.setAttribute('content', '#C2C2C2'); // Replace with your desired color code
    } else {
      themeColorMetaTag.setAttribute('content', '#ffffff'); // Replace with your desired color code
    }
  },[showPopup])

  async function getReservations() {
    const querySnapshot = await getDocs(collection(db, "Bookings"));
    let reservations = [];
    querySnapshot.forEach((doc) => {
      isDateExpired(doc.data().date) && deleteExpired(doc.id); // if statement
      reservations.push({
        firstName: doc.data().firstName,
        lastName: doc.data().lastName,
        code: doc.data().code,
        phone: doc.data().phone,
        email: doc.data().email,
        activity: doc.data().activity,
        divingCourse: doc.data().divingCourse,
        lastDive: doc.data().lastDive,
        lastCertification: doc.data().lastCertification,
        divingActivity: doc.data().divingActivity,
        numOfPeople: doc.data().numOfPeople,
        tour: doc.data().tour,
        date: doc.data().date,
        status: doc.data().status,
        id: doc.id,
      });
    });
    setReservations(reservations);
  }

  function formattDate(date) {
    const inputDate = new Date(date);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = inputDate.toLocaleDateString("en-US", options);
    return formattedDate;
  }

  function verticalDate(dateStr) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date(dateStr);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();


    return [day + 1, month, year];
  }

  function openPopup(id) {
    for(let i =0; i < reservations.length; i ++){
      if(reservations[i].id == id){
        setShowPopup(true);
        setCurrentReservation(reservations[i]);
      }
    }
  }

  async function updateStatus(id, status) {
    const bookingRef = doc(db, "Bookings", id);
    await updateDoc(bookingRef, {
      status: status,
    });

    setShowPopup(false);
    getReservations();
  }

  function isDateExpired(date) {
    // Parse the input date string to a Date object
    const inputDate = new Date(date);
  
    // Get the current date
    const currentDate = new Date();
  
    // Compare the input date with the current date
    return inputDate < currentDate;
  }

  async function deleteExpired(id){
    await deleteDoc(doc(db, "Bookings", id));
  }

  return (
    <div className="wrapper-management">
      <div className="header">
        <img src={logo} />
      </div>
      <h2> Reservations </h2>
      <div className="toggler">
        <button
          onClick={() => setFilter(1)}
          className={filter == 1 ? "focus" : ""}
          id="left"
        >
          {" "}
          Approved{" "}
        </button>
        <button
          onClick={() => setFilter(2)}
          className={filter == 2 ? "focus" : ""}
          id="center"
        >
          {" "}
          Pending{" "}
        </button>
        <button
          onClick={() => setFilter(3)}
          className={filter == 3 ? "focus" : ""}
          id="right"
        >
          {" "}
          Declined{" "}
        </button>
      </div>
      {reservations
        .filter((reservation) => {
          if (filter === 1) {
            return reservation.status === "Approved";
          } else if (filter === 2) {
            return reservation.status === "Pending";
          } else if (filter === 3) {
            return reservation.status === "Declined";
          }
          return false;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((reservation, key) => (
          <div
            key={key}
            className="reservations-row"
            onClick={() => openPopup(reservation.id)}
          >
            <div>
              <i
                style={{
                  display: reservation.status == "Approved" ? "block" : "none",
                }}
                className="row-status-icon bi bi-check-circle"
              />
              <i
                style={{
                  display: reservation.status == "Declined" ? "block" : "none",
                }}
                className="row-status-icon bi bi-x-circle"
              />
              <i
                style={{
                  display: reservation.status == "Pending" ? "block" : "none",
                }}
                className="row-status-icon bi bi-clock-history"
              />
            </div>
            <div>
              <p id="name" className="uppercase">
                {reservation.firstName} {reservation.lastName}{" "}
              </p>
              <p> {reservation.activity}</p>
              <p>
                {reservation.activity == "Diving"
                  ? reservation.divingActivity
                  : ""}
              </p>
              <p>
                {reservation.activity == "Packages & Tours"
                  ? reservation.tour
                  : ""}
              </p>
              <p>
                {reservation.activity == "Diving Courses"
                  ? reservation.divingCourse
                  : ""}
              </p>
            </div>
            <div>
              <div className="verticalDate">
                <p id="day"> {verticalDate(reservation.date)[0]} </p>
                <p id="month"> {verticalDate(reservation.date)[1]} </p>
                <p id="year"> {verticalDate(reservation.date)[2]} </p>
              </div>
            </div>
          </div>
        ))}

      <div
        className="overlay"
        onClick={() => setShowPopup(false)}
        style={{ display: showPopup ? "block" : "none" }}
      ></div>
      <div className="popup" style={{ display: showPopup ? "block" : "none" }}>
        <div className="details">
          <h2> Booking Information </h2>
          <p className="capitalized">
            <i className="bi bi-person reservation-icons"></i>
            {currentReservation.firstName} {currentReservation.lastName}{" "}
          </p>
          <p>
            <i className="bi bi-envelope reservation-icons"></i>
            {currentReservation.email}
          </p>
          <p>
            <i className="bi bi-telephone reservation-icons"></i>+
            {currentReservation.code} {currentReservation.phone}
          </p>

          <div
            style={{
              display:
                currentReservation.activity == "Diving" ? "block" : "none",
            }}
          >
            <p>
              <i className="bi bi-water reservation-icons"></i>
              {currentReservation.activity} -{" "}
              {currentReservation.divingActivity}
            </p>
            <p>
              <i className="bi bi-people reservation-icons"></i>
              {currentReservation.numOfPeople + " people"}{" "}
            </p>
          </div>
          <div
            style={{
              display:
                currentReservation.activity == "Packages & Tours"
                  ? "block"
                  : "none",
            }}
          >
            <p>
              <i className="bi bi-water reservation-icons"></i>
              {currentReservation.activity} - {currentReservation.tour}
            </p>
            <p>
              <i className="bi bi-people reservation-icons"></i>
              {currentReservation.numOfPeople + " people"}{" "}
            </p>
          </div>
          <div
            style={{
              display:
                currentReservation.activity == "Diving Courses"
                  ? "block"
                  : "none",
            }}
          >
            <p>
              <i className="bi bi-water reservation-icons"></i>
              {currentReservation.divingCourse}
            </p>
            <p>
              <i className="bi bi-award reservation-icons"></i>
              {currentReservation.lastCertification}{" "}
            </p>
            <p>
              <i className="bi bi-card-list reservation-icons"></i>
              {currentReservation.lastDive}{" "}
            </p>
          </div>
          <p>
            <i className="bi bi-calendar-check reservation-icons"></i>{" "}
            {formattDate(currentReservation.date)}{" "}
          </p>
        </div>

        <div
          className="action-btns"
          style={{
            display: currentReservation.status == "Pending" ? "flex" : "none",
          }}
        >
          <button
            id="decline"
            onClick={() => updateStatus(currentReservation.id, "Declined")}
          >
            {" "}
            Decline{" "}
          </button>
          <button
            id="accept"
            onClick={() => updateStatus(currentReservation.id, "Approved")}
          >
            {" "}
            Accept{" "}
          </button>
        </div>

        <div className="reservation-status" style={{display: currentReservation.status == "Pending" ? "none" : "block", }}>
          <i className={ currentReservation.status == "Approved" ? "bi bi-check-circle statusIcon approved" : "bi bi-x-circle statusIcon declined" }></i>
          <p>{currentReservation.status == "Approved" ? "Approved" : "Declined"} </p>
        </div>
      </div>
      <img className="divider" src={divider}/>
    </div>
  );
}

export default Management;
