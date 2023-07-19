import React, { useEffect } from 'react'
import './profilestatus.css'
// import axios from 'axios'
import { useNavigate } from 'react-router-dom';



const ProfileStatus = () => {
  // const navigate = useNavigate()
  const [user, setUser] = React.useState({})


  // axios.defaults.withCredentials = true
  // useEffect(() => {
  //   axios.get('http://localhost:5000/student/studentdetails', { withCredentials: true })
  //     .then((res) => {
  //       setUser(res.data)
  //     }).catch((error) => {
  //       console.log(error.response.data.user)
  //       if (error.response.data.user === false) {
  //         navigate('/login')
  //       }
  //     })
  // }, [])
  return (
    <div className='container'>
    <h2>اضافه طالب</h2>

    <table style={{direction:"rtl"}}>
      <thead>
        <th>
          <td>اسم الطالب</td>
          <td>رقم الطالب</td>
          <td>الرقم القومى</td>
          <td>الماده الاولى</td>
          <td>الماده الثانيه</td>
          <td>الماده الثالثه</td>
          <td>الماده الرابعه</td>
          <td>الماده الخامسه</td>
          <td>الماده السادسه</td>
          <td>الماده السابعه</td>
          <td>اضافه</td>
          <td></td>
        </th>
      </thead>
      <tbody>

      </tbody>

    </table>
    </div>
  )
}

export default ProfileStatus