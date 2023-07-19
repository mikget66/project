import React from 'react'
import './contact.css'

import { HiOutlineMail } from 'react-icons/hi'
import { BsPhone } from 'react-icons/bs'
import Image from '../../../images/contact_us.jpg'

const Grade = () => {
  
  return ( 
      <div className="container">
          <h2>اضافه الدرجات</h2>
          <div className="grid">
            <div className="one">
              <h3>درجات الفصل الاول</h3>
            </div>
            <div className="two">
              <h3>درجات الفصل الثانى</h3>
            </div>
          </div>
      </div>
  )
}

export default Grade