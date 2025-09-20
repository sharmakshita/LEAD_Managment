import { useState } from "react";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";

const LeadForm = () => {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", company: "", city: "", state: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/leads", form);
    navigate("/leads");
  };

  return (
    <div>
      <h2>Create Lead</h2>
      <form onSubmit={handleSubmit}>
        <input name="first_name" placeholder="First Name" onChange={handleChange} />
        <input name="last_name" placeholder="Last Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="company" placeholder="Company" onChange={handleChange} />
        <input name="city" placeholder="City" onChange={handleChange} />
        <input name="state" placeholder="State" onChange={handleChange} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default LeadForm;
