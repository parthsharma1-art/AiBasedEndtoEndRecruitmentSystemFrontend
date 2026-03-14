import React from "react";
import { FaBriefcase, FaUserGraduate } from "react-icons/fa";
import "./LoadingScreen.css";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-screen__content">
        <h1 className="loading-screen__title">
          AI Based End to End Recruitment System
        </h1>
        <div className="loading-screen__icons">
          <div className="loading-screen__icon loading-screen__icon--recruiter">
            <FaBriefcase aria-hidden="true" />
            <span>Recruiter</span>
          </div>
          <div className="loading-screen__icon loading-screen__icon--candidate">
            <FaUserGraduate aria-hidden="true" />
            <span>Candidate</span>
          </div>
        </div>
        <div className="loading-screen__bar">
          <div className="loading-screen__bar-fill" />
        </div>
      </div>
    </div>
  );
}
