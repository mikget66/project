
import React,{useState} from 'react'
import './navbar.css'


import { Link } from 'react-router-dom'
// import axios from 'axios'
import { useNavigate } from 'react-router-dom';



const Navbar = ({ User }) => {
  
  


  // const navigate = useNavigate()



  const logout = () => {
    // try {
    //   axios.defaults.withCredentials = true
    //   axios.get('http://localhost:5000/logout', { withCredentials: true })
    //     .then((res) => {
    //       navigate('/login')
    //     }).catch((error) => {
    //       console.log(error)
    //     })
    // } catch (error) {
    //   console.log(error)
    // }
  }

  return (
    <nav  style={{ direction: "rtl" }}>
      <div>
      <button
        onClick={logout}
        className="btn">تسجيل الخروج
      </button>
      </div>
      <ul>
        <li>
          <Link to='/admin' >اضافه طالب</Link>
        </li>
        <li>
          <Link to='/admin/ADDgrades' >اضافه الدرجات</Link>
        </li>
        <li>
          <Link to='/admin/EDITgrades' >تعديل الدرجات</Link>
        </li>
      </ul>
    </nav>

  )
}

export default Navbar