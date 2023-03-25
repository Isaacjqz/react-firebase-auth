import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db as firebaseDB } from "../firebase";
import { toast } from "react-toastify";
import "./Home.css";

const Home = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    firebaseDB.child("contacts").on("value", (snapshot) => {
      if (snapshot.val() !== null) {
        setData(snapshot.val());
      } else {
        setData({});
      }
    });

    return () => {
      setData({});
    };
  }, []);

  const onDelete = (id) => {
    if (window.confirm("Are you sure you want to delete contact?")) {
      firebaseDB.child(`contacts/${id}`).remove((err) => {
        if (err) {
          toast.error(err);
        } else {
          toast.success("Contact Deleted Successfully");
        }
      });
    }
  };

  const filterData = (status) => {
    firebaseDB
      .child("contacts")
      .orderByChild("status")
      .equalTo(status)
      .on("value", (snapshot) => {
        if (snapshot.val) {
          setData({ ...snapshot.val() });
        } else {
          setData({});
        }
      });
  };

  return (
    <div style={{ marginTop: "100px" }}>
      <table className="style-table">
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>No.</th>
            <th style={{ textAlign: "center" }}>Name</th>
            <th style={{ textAlign: "center" }}>Email</th>
            <th style={{ textAlign: "center" }}>Status</th>
            <th style={{ textAlign: "center" }}>Contact</th>
            <th style={{ textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(data).map((id, index) => {
            return (
              <tr key={id}>
                <th scope="row">{index + 1}</th>
                <td>{data[id].name}</td>
                <td>{data[id].email}</td>
                <td>{data[id].status}</td>
                <td>{data[id].contact}</td>
                <td>
                  <Link to={`/update/${id}`}>
                    <button className="bttn btn-edit">Edit</button>
                  </Link>

                  <button
                    className="bttn btn-delete"
                    onClick={() => onDelete(id)}
                  >
                    Delete
                  </button>

                  <Link to={`/view/${id}`}>
                    <button className="bttn btn-view">View</button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <label>Status:</label>
      <button className="bttn btn-active" onClick={() => filterData("Active")}>
        Active
      </button>
      <button
        className="bttn btn-inactive"
        onClick={() => filterData("Inactive")}
      >
        Inactive
      </button>
    </div>
  );
};

export default Home;
