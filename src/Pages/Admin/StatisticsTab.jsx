import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import {
  FaUsers,
  FaQuestionCircle,
  FaBed,
  FaStethoscope,
  FaClipboardCheck,
  FaChalkboardTeacher,
  FaClipboardList,
  FaUser,
} from "react-icons/fa";
import "./StatisticsTab.css";

function StatisticsTab() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const [data, setData] = useState({
    attendees: 0,
    roomInquiries: 0,
    cleaning: 0,
    medicalService: 0,
    clearance: 0,
    leaveRequest: 0,
    users: 0,
  });

  const fetchData = async () => {
    try {
      const endpoints = [
        `${process.env.REACT_APP_API_BASE_URL}/api/accommodation`,
        `${process.env.REACT_APP_API_BASE_URL}/api/inquiries`,
        `${process.env.REACT_APP_API_BASE_URL}/api/cleaning`,
        `${process.env.REACT_APP_API_BASE_URL}/api/medical`,
        `${process.env.REACT_APP_API_BASE_URL}/api/clearance`,
        `${process.env.REACT_APP_API_BASE_URL}/api/leave`,
        `${process.env.REACT_APP_API_BASE_URL}/api/user/getAllUsers`,
      ];

      const counts = await Promise.all(
        endpoints.map(async (endpoint) => {
          const response = await axios.get(endpoint);
          if (endpoint.includes("user/getAllUsers")) {
            // Extract user count from the response
            return response.data.users.length;
          }
          return response.data.length;
        })
      );

      setData({
        attendees: counts[0],
        roomInquiries: counts[1],
        cleaning: counts[2],
        medicalService: counts[3],
        clearance: counts[4],
        leaveRequest: counts[6],
        users: counts[7],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const barChartData = {
    labels: [
      "Attendees",
      "Room Inquiries",
      "Cleaning",
      "Medical Service",
      "Clearance",
      "Leave Request",
      "Users",
    ],
    series: [
      data.attendees,
      data.roomInquiries,
      data.cleaning,
      data.medicalService,
      data.clearance,
      data.leaveRequest,
      data.users,
    ],
  };

  const barChartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: [
      "#007BFF",
      "#FFC107",
      "#28A745",
      "#FF5733",
      "#6F42C1",
      "#20C997",
      "#343A40",
    ],
    xaxis: {
      categories: barChartData.labels,
    },
    yaxis: {
      title: {
        text: "Counts",
        style: {
          fontSize: "16px",
          fontWeight: 600,
        },
      },
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: "14px",
      },
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="statistics-tab">
      <div>
        <div>
          <h2>Statistics</h2>
        </div>
        <div className="live-date-time">{currentDateTime.toLocaleString()}</div>
      </div>

      <div className="card-container">
        <div className="card card-blue">
          <div className="card-icon blue">
            <FaUsers />
          </div>
          <div className="card-text">
            <div className="card-title">Attendees</div>
            <div className="card-value">{data.attendees}</div>
          </div>
        </div>
        <div className="card card-yellow">
          <div className="card-icon yellow">
            <FaQuestionCircle />
          </div>
          <div className="card-text">
            <div className="card-title">Room Inquiries</div>
            <div className="card-value">{data.roomInquiries}</div>
          </div>
        </div>
        <div className="card card-green">
          <div className="card-icon green">
            <FaBed />
          </div>
          <div className="card-text">
            <div className="card-title">Cleaning</div>
            <div className="card-value">{data.cleaning}</div>
          </div>
        </div>
        <div className="card card-orange">
          <div className="card-icon orange">
            <FaStethoscope />
          </div>
          <div className="card-text">
            <div className="card-title">Medical Service</div>
            <div className="card-value">{data.medicalService}</div>
          </div>
        </div>
        <div className="card card-purple">
          <div className="card-icon purple">
            <FaClipboardCheck />
          </div>
          <div className="card-text">
            <div className="card-title">Clearance</div>
            <div className="card-value">{data.clearance}</div>
          </div>
        </div>
        <div className="card card-teal">
          <div className="card-icon teal">
            <FaClipboardList />
          </div>
          <div className="card-text">
            <div className="card-title">Leave Request</div>
            <div className="card-value">{data.leaveRequest}</div>
          </div>
        </div>
        <div className="card card-dark">
          <div className="card-icon dark">
            <FaUser />
          </div>
          <div className="card-text">
            <div className="card-title">Users</div>
            <div className="card-value">{data.users}</div>
          </div>
        </div>
      </div>
      <div className="chart-container">
        <div className="chart">
          <h3>Bar Chart</h3>
          <ReactApexChart
            options={barChartOptions}
            series={[{ data: barChartData.series }]}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
}

export default StatisticsTab;
